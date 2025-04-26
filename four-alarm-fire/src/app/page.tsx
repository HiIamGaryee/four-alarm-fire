"use client";

import * as React from "react";
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

export default function InputStatement() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

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
    Object.fromEntries(uploadSections.map(({ key }) => [key, []]))
  );

  const handleFiles =
    (key: string) => (e: React.ChangeEvent<HTMLInputElement> | File[]) => {
      const selected =
        e instanceof Array
          ? e
          : e.target.files
            ? Array.from(e.target.files)
            : [];
      setFiles((prev) => ({ ...prev, [key]: selected }));
      // TODO: parse PDFs ⇒ update dashboard metrics
    };

  const onSubmit = () => {
    setLoading(true);
    setTimeout(() => router.push("/dashboard"), 3000);
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
