"use client";

import * as React from "react";
import { useUploadStore } from "@/stores/upload";
import Tesseract, { createWorker } from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

const schema = z.object({
  userName: z.string().min(3),
  income: z.string().min(1),
  dob: z.string().min(1),
  email: z.string().email(),
});

/* upload groups */
const sections = [
  { key: "bank", label: "Bank Statements", bg: "#f5e8af" }, // panel-100
  { key: "income", label: "Income Data", bg: "#fadbc8" }, // eligibility-100
  { key: "savings", label: "Savings Data", bg: "#d9e3e8" }, // sky-100
  { key: "personal", label: "Personal Info", bg: "#c3b0bc" }, // yam-100
] as const;

/* ------------------------------------------------------------------ */
export default function InputStatement() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  /* pdf.js worker path */
  React.useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }, []);

  /* form */
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { userName: "", income: "", dob: "", email: "" },
  });

  /* files per section */
  const [files, setFiles] = React.useState<Record<string, File[]>>(
    Object.fromEntries(sections.map(({ key }) => [key, []]))
  );
  const handleFiles = (key: string) => (newFiles: File[]) =>
    setFiles((prev) => ({ ...prev, [key]: newFiles }));

  /* ---------- parsing helpers ------------------------------------ */
  const extractTextFromImage = async (file: File) => {
    try {
      const { data } = await Tesseract.recognize(file, "eng");
      return data.text;
    } catch (error) {
      console.error("Error extracting text from image:", error);
      return ""; // Return empty string on failure
    }
  };

  const extractTextFromPdf = async (file: File) => {
    try {
      const buf = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      let out = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const txt = await page.getTextContent();
        out += txt.items.map((it: any) => it.str).join(" ") + "\n";
      }
      return out;
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      return ""; // Return empty string on failure
    }
  };

  const parseFiles = async (inner: File[]) => {
    const textArr: string[] = [];
    for (const f of inner) {
      let extractedText = "";
      if (f.type.includes("image")) {
        extractedText = await extractTextFromImage(f);
      } else if (f.type.includes("pdf")) {
        extractedText = await extractTextFromPdf(f);
      } else {
        extractedText = await f.text();
      }
      textArr.push(extractedText);
    }
    return textArr.join("\n\n");
  };

  const parseAllFiles = async () => {
    const out: Record<string, string> = {};
    for (const { key } of sections) {
      if (files[key].length) {
        const parsedText = await parseFiles(files[key]);
        out[key] = parsedText;
        // If parsing failed and the text is empty, use a hardcoded value
        if (!parsedText.trim()) {
          console.warn(
            `Failed to parse files for section "${key}". Using hardcoded value.`
          );
          out[key] = `Hardcoded data for ${key} due to parsing failure.`;
        }
      } else {
        out[key] = ""; // No files uploaded for this section
      }
    }
    return out;
  };
  /* --------------------------------------------------------------- */

  const submit = async (values: FormValues) => {
    setDialogOpen(false);
    setLoading(true);

    try {
      const docs = await parseAllFiles(); // OCR & PDF parse

      const statement = {
        customer: {
          name: values.userName,
          email: values.email,
          incomeMonthly: +values.income,
          debtsMonthly: 2100, // Hardcoded default
          utilization: 0.2, // Hardcoded default
        },
        documents: docs, // <- extracted text goes here
        monthlySpending: [
          2000,
          1800,
          1900,
          2100,
          2200,
          2300,
          2400,
          2500,
          2600,
          2700,
          2800,
          2900, // Hardcoded default
        ],
        rentPayments: [
          2000,
          1800,
          1900,
          2100,
          2200,
          2300,
          2400,
          2500,
          2600,
          2700,
          2800,
          2900, // Hardcoded default
        ],
      };

      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(statement),
      });

      if (res.ok) {
        localStorage.setItem("aiReport", JSON.stringify(await res.json()));
      } else localStorage.removeItem("aiReport");
    } catch (error) {
      console.error("Error submitting data:", error);
      localStorage.removeItem("aiReport");
    } finally {
      setLoading(false);
      router.push("/dashboard");
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
          <form className="space-y-4">
            {/* customer block */}
            <Card
              className="mt-5 flex flex-col p-6"
              style={{ backgroundColor: "#f2d1cc" }}
            >
              <Label className="mb-2 text-lg font-semibold">
                Customer&apos;s Information
              </Label>

              {(["userName", "income", "dob", "email"] as const).map((name) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {
                          {
                            userName: "User Name",
                            income: "Income (RM)",
                            dob: "Date of Birth",
                            email: "Email",
                          }[name]
                        }
                      </FormLabel>
                      <Input
                        {...field}
                        type={
                          name === "income"
                            ? "number"
                            : name === "dob"
                              ? "date"
                              : name === "email"
                                ? "email"
                                : "text"
                        }
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </Card>

            {/* file grid */}
            <div className="my-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {sections.map(({ key, label, bg }) => (
                <Card
                  key={key}
                  className="pt-3"
                  style={{ backgroundColor: bg }}
                >
                  <Label className="ml-5 mb-2 text-lg font-semibold">
                    {label}
                  </Label>
                  <FileUpload
                    value={files[key]}
                    onValueChange={handleFiles(key)}
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
                          Or click to browse&nbsp;(max&nbsp;2,&nbsp;5&nbsp;MB)
                        </p>
                      </div>
                      <FileUploadTrigger asChild>
                        <Button variant="outline" size="sm" className="mt-2">
                          Browse files
                        </Button>
                      </FileUploadTrigger>
                    </FileUploadDropzone>

                    <FileUploadList>
                      {files[key].map((f, i) => (
                        <FileUploadItem key={i} value={f}>
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

            {/* confirm dialog */}
            <div className="flex justify-end">
              <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    className="bg-[#90d363] text-white hover:bg-[#90d363]/80"
                    onClick={() =>
                      form.trigger().then((ok) => ok && setDialogOpen(true))
                    }
                  >
                    Save &amp; Submit
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-center">
                      Submit your statement?
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <div className="text-center text-gray-600">
                    By proceeding with the submission, you hereby grant your
                    explicit consent for the collection, processing, and storage
                    of your personal data in accordance with our established
                    Privacy Policy. Please ensure you have reviewed and
                    understood the terms outlined therein regarding the handling
                    of your information.
                  </div>
                  <AlertDialogFooter className="flex justify-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                    >
                      No
                    </Button>
                    <Button onClick={form.handleSubmit(submit)}>Yes</Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </form>
        </Form>
      </div>

      {/* loader spinner */}
      <style jsx global>{`
        .loader {
          width: 50px;
          aspect-ratio: 1;
          border-radius: 50%;
          border: 8px solid transparent;
          border-right-color: #ffa50097;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}
