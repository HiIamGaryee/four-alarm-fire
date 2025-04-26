"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import * as React from "react";
import { Upload, X } from "lucide-react";

export default function Home() {
  const [files, setFiles] = React.useState<File[]>([]);

  const formSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  return (
    <div className="h-full w-full px-5 pt-5">
      <SidebarTrigger />
      <h1 className="text-3xl font-semibold mt-5">Dashboard</h1>
      <Card className="mt-5 flex flex-col justify-center p-6">
        <Label className="font-semibold text-lg mb-2">
          Customer&apos;s Information
        </Label>
        <Form {...form}>
          <FormField
            name="name"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Name</FormLabel>
                <Input placeholder="Enter your name" {...field} />
              </FormItem>
            )}
          />
          <FormField
            name="email"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Email</FormLabel>
                <Input placeholder="Enter your email" {...field} />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Notes</FormLabel>
                <Textarea placeholder="Enter your notes" {...field} rows={4} />
              </FormItem>
            )}
          />
          <FormItem>
            <Button className="w-full bg-black text-white hover:bg-black/80">
              Sign in
            </Button>
          </FormItem>
        </Form>
      </Card>
      <div className="mt-5 flex gap-4">
        <Card className="mb-5 pt-3">
          <Label className="font-semibold text-lg mb-2 ml-5">Income Data</Label>
          <FileUpload
            maxFiles={2}
            maxSize={5 * 1024 * 1024}
            className="w-2/3 mx-auto my-3 mb-5"
            value={files}
            onValueChange={setFiles}
            multiple
          >
            <FileUploadDropzone>
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center justify-center rounded-full border p-2.5">
                  <Upload className="size-6 text-muted-foreground" />
                </div>
                <p className="font-medium text-sm">Drag & drop files here</p>
                <p className="text-muted-foreground text-xs">
                  Or click to browse (max 2 files, up to 5MB each)
                </p>
              </div>
              <FileUploadTrigger asChild>
                <Button variant="outline" size="sm" className="mt-2 w-fit">
                  Browse files
                </Button>
              </FileUploadTrigger>
            </FileUploadDropzone>
            <FileUploadList>
              {files.map((file, index) => (
                <FileUploadItem key={index} value={file}>
                  <FileUploadItemPreview />
                  <FileUploadItemMetadata />
                  <FileUploadItemDelete asChild>
                    <Button variant="ghost" size="icon" className="size-7">
                      <X />
                    </Button>
                  </FileUploadItemDelete>
                </FileUploadItem>
              ))}
            </FileUploadList>
          </FileUpload>
        </Card>
        <Card className="mb-5 pt-3">
          <Label className="font-semibold text-lg mb-2 ml-5">Income Data</Label>
          <FileUpload
            maxFiles={2}
            maxSize={5 * 1024 * 1024}
            className="w-2/3 mx-auto my-3"
            value={files}
            onValueChange={setFiles}
            multiple
          >
            <FileUploadDropzone>
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center justify-center rounded-full border p-2.5">
                  <Upload className="size-6 text-muted-foreground" />
                </div>
                <p className="font-medium text-sm">Drag & drop files here</p>
                <p className="text-muted-foreground text-xs">
                  Or click to browse (max 2 files, up to 5MB each)
                </p>
              </div>
              <FileUploadTrigger asChild>
                <Button variant="outline" size="sm" className="mt-2 w-fit">
                  Browse files
                </Button>
              </FileUploadTrigger>
            </FileUploadDropzone>
            <FileUploadList>
              {files.map((file, index) => (
                <FileUploadItem key={index} value={file}>
                  <FileUploadItemPreview />
                  <FileUploadItemMetadata />
                  <FileUploadItemDelete asChild>
                    <Button variant="ghost" size="icon" className="size-7">
                      <X />
                    </Button>
                  </FileUploadItemDelete>
                </FileUploadItem>
              ))}
            </FileUploadList>
          </FileUpload>
        </Card>
        <Card className="mb-5 pt-3">
          <Label className="font-semibold text-lg mb-2 ml-5">Income Data</Label>
          <FileUpload
            maxFiles={2}
            maxSize={5 * 1024 * 1024}
            className="w-2/3 mx-auto my-3"
            value={files}
            onValueChange={setFiles}
            multiple
          >
            <FileUploadDropzone>
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center justify-center rounded-full border p-2.5">
                  <Upload className="size-6 text-muted-foreground" />
                </div>
                <p className="font-medium text-sm">Drag & drop files here</p>
                <p className="text-muted-foreground text-xs">
                  Or click to browse (max 2 files, up to 5MB each)
                </p>
              </div>
              <FileUploadTrigger asChild>
                <Button variant="outline" size="sm" className="mt-2 w-fit">
                  Browse files
                </Button>
              </FileUploadTrigger>
            </FileUploadDropzone>
            <FileUploadList>
              {files.map((file, index) => (
                <FileUploadItem key={index} value={file}>
                  <FileUploadItemPreview />
                  <FileUploadItemMetadata />
                  <FileUploadItemDelete asChild>
                    <Button variant="ghost" size="icon" className="size-7">
                      <X />
                    </Button>
                  </FileUploadItemDelete>
                </FileUploadItem>
              ))}
            </FileUploadList>
          </FileUpload>
        </Card>
        <Card className="mb-5 pt-3">
          <Label className="font-semibold text-lg mb-2 ml-5">Income Data</Label>
          <FileUpload
            maxFiles={2}
            maxSize={5 * 1024 * 1024}
            className="w-2/3 mx-auto my-3"
            value={files}
            onValueChange={setFiles}
            multiple
          >
            <FileUploadDropzone>
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center justify-center rounded-full border p-2.5">
                  <Upload className="size-6 text-muted-foreground" />
                </div>
                <p className="font-medium text-sm">Drag & drop files here</p>
                <p className="text-muted-foreground text-xs">
                  Or click to browse (max 2 files, up to 5MB each)
                </p>
              </div>
              <FileUploadTrigger asChild>
                <Button variant="outline" size="sm" className="mt-2 w-fit">
                  Browse files
                </Button>
              </FileUploadTrigger>
            </FileUploadDropzone>
            <FileUploadList>
              {files.map((file, index) => (
                <FileUploadItem key={index} value={file}>
                  <FileUploadItemPreview />
                  <FileUploadItemMetadata />
                  <FileUploadItemDelete asChild>
                    <Button variant="ghost" size="icon" className="size-7">
                      <X />
                    </Button>
                  </FileUploadItemDelete>
                </FileUploadItem>
              ))}
            </FileUploadList>
          </FileUpload>
        </Card>
      </div>
    </div>
  );
}
