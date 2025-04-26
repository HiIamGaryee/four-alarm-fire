"use client";

import * as React from "react";
import { useUploadStore } from "@/stores/upload";
import Tesseract, { createWorker } from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadTrigger,
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemMetadata,
  FileUploadItemDelete,
} from "@/components/ui/file-upload";
import { Upload, X } from "lucide-react";

type FormValues = {
  userName: string;
  income: string;
  dob: string;
  email: string;
};

const formSchema = z.object({
  userName: z.string().min(3, "Too short"),
  income: z.string().min(1, "Required"),
  dob: z.string().min(1, "Required"),
  email: z.string().email("Invalid"),
});

const uploadSections = [
  { key: "bank", label: "Bank Statements" },
  { key: "income", label: "Income Data" },
  { key: "savings", label: "Savings Data" },
  { key: "personal", label: "Personal Info" },
] as const;

// pdfjsLib.GlobalWorkerOptions.workerSrc = `/_next/static/worker/pdf.worker.min.mjs`;

export default function InputStatement() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const loadPdfWorker = async () => {
      // Dynamic import avoids the TypeScript declaration error
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    };

    loadPdfWorker();
  }, []);

  const [parsedData, setParsedData] = React.useState<{
    bank: any;
    income: any;
    savings: any;
    personal: any;
  }>({
    bank: null,
    income: null,
    savings: null,
    personal: null,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      income: "",
      dob: "",
      email: "",
    },
  });

  const [files, setFiles] = React.useState<Record<string, File[]>>(
    Object.fromEntries(uploadSections.map(({ key }) => [key, []])),
  );

  const handleFiles =
    (key: (typeof uploadSections)[number]["key"]) =>
    async (newFiles: File[]) => {
      setFiles((prev) => ({
        ...prev,
        [key]: newFiles,
      }));

      // parse files immediately after upload
      if (newFiles.length > 0) {
        const parsed = await parseFiles(newFiles, key);
        setParsedData((prev) => ({
          ...prev,
          [key]: parsed,
        }));
      }
    };

  const parseAllFiles = async (files: Record<string, File[]>) => {
    const results: Record<string, string> = {};

    try {
      const worker = await createWorker("eng"); // load English model once
      for (const key of Object.keys(files)) {
        const sectionFiles = files[key];
        const parsed = await parseFiles(sectionFiles, key);

        results[key] = Array.isArray(parsed) ? parsed.join("\n\n") : parsed;
      }

      await worker.terminate(); // clean up
    } catch (error) {
      console.error("Error parsing files:", error);
    }

    return results;
  };

  const extractTextFromFile = async (worker: any, file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer]);
    const imageBitmap = await createImageBitmap(blob);

    const canvas = document.createElement("canvas");
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(imageBitmap, 0, 0);

    const {
      data: { text },
    } = await worker.recognize(canvas);

    return text;
  };
  async function parseFiles(files: File[], key: string) {
    const results: string[] = [];

    for (const file of files) {
      if (file.type.includes("image")) {
        // OCR for images
        const text = await extractTextFromImage(file);
        results.push(text);
      } else if (file.type.includes("pdf")) {
        // Extract text from PDFs
        const text = await extractTextFromPdf(file);
        results.push(text);
      } else {
        // fallback
        const text = await file.text();
        results.push(text);
      }
    }

    return results.length === 1 ? results[0] : results;
  }

  async function extractTextFromImage(file: File) {
    try {
      const { data } = await Tesseract.recognize(file, "eng", {
        logger: (m) => console.log(m), // optional for progress
      });
      return data.text;
    } catch (error) {
      console.error("Error extracting text from image:", error);
      return `[Error processing image: ${file.name}]`;
    }
  }

  async function extractTextFromPdf(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let textContent = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item: any) => item.str);
      textContent += strings.join(" ") + "\n";
    }

    return textContent;
  }

  const onSubmit = async () => {
    try {
      setLoading(true);
      const parsed = await parseAllFiles(files);
      useUploadStore.getState().setParsedData(parsed);
      setLoading(false);

      router.push("/dashboard");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="loader" />
        </div>
      )}

      <div className="h-full w-full px-5 pt-5">
        <SidebarTrigger />
        <h1 className="mt-5 text-3xl font-semibold">Input Statement</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Card className="mt-5 flex flex-col p-6">
              <Label className="mb-2 text-lg font-semibold">
                Customer&apos;s Information
              </Label>

              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Name</FormLabel>
                    <Input
                      placeholder="Enter your name"
                      {...field}
                      autoComplete="off"
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="income"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Income (RM)</FormLabel>
                    <Input
                      type="number"
                      placeholder="65000"
                      {...field}
                      autoComplete="off"
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <Input type="date" {...field} autoComplete="off" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormItem>
                )}
              />
            </Card>

            <div className="my-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {uploadSections.map(({ key, label }) => (
                <Card key={key} className="pt-3">
                  <Label className="ml-5 mb-2 text-lg font-semibold">
                    {label}
                  </Label>
                  <FileUpload
                    value={files[key]}
                    onValueChange={(f) => handleFiles(key)(f)}
                    maxFiles={2}
                    maxSize={5 * 1024 * 1024}
                    multiple
                    className="mx-auto my-3 w-2/3"
                  >
                    <FileUploadDropzone>
                      <div className="flex flex-col items-center gap-1">
                        <div className="rounded-full border p-2.5">
                          <Upload className="size-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium">
                          Drag &amp; drop files here
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Or click to
                          browse&nbsp;(max&nbsp;2,&nbsp;up&nbsp;to&nbsp;5&nbsp;MB)
                        </p>
                      </div>
                      <FileUploadTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 w-fit"
                        >
                          Browse files
                        </Button>
                      </FileUploadTrigger>
                    </FileUploadDropzone>

                    <FileUploadList>
                      {files[key].map((file, i) => (
                        <FileUploadItem key={i} value={file}>
                          <FileUploadItemPreview />
                          <FileUploadItemMetadata />
                          <FileUploadItemDelete asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7"
                            >
                              <X />
                            </Button>
                          </FileUploadItemDelete>
                        </FileUploadItem>
                      ))}
                    </FileUploadList>
                  </FileUpload>
                </Card>
              ))}
            </div>
            <div className="justify-end flex">
              <Button
                type="submit"
                className="bg-black text-white hover:bg-black/80"
                onClick={onSubmit}
              >
                Save & Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <style jsx global>{`
        .loader {
          width: 50px;
          aspect-ratio: 1;
          border-radius: 50%;
          border: 8px solid #0000;
          border-right-color: #ffa50097;
          position: relative;
          animation: l24 1s infinite linear;
        }
        .loader:before,
        .loader:after {
          content: "";
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: inherit;
          animation: inherit;
          animation-duration: 2s;
        }
        .loader:after {
          animation-duration: 4s;
        }
        @keyframes l24 {
          100% {
            transform: rotate(1turn);
          }
        }
      `}</style>
    </>
  );
}
