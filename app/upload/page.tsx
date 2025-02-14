"use client";

import { useState } from "react";
import { FileUpload } from "@/components/fileupload";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import Header from "@/components/header";
import Dropzone from "shadcn-dropzone";
import { Card, CardContent } from "@/components/ui/card";

export default function Upload() {
  const router = useRouter();
  const [file, setFile] = useState<File>();
  return (
    <div className="w-full h-full flex flex-col">
      <Header>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>Upload</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>
      <div className="flex-1 overflow-auto p-4 flex flex-col items-center justify-center">
        {file ? (
          <FileUpload
            file={file}
            onClose={() => setFile(undefined)}
            uploaded={(id) => {
              router.push(`/upload/${id}`);
            }}
          ></FileUpload>
        ) : (
          <Card className="">
            <CardContent id="card-content" className="pt-6">
              <Dropzone
                maxSize={4 * 1024 * 1024}
                accept={{ "image/jpeg": [] }}
                containerClassName="h-50 w-100 items-center justify-center"
                maxFiles={1}
                onDrop={(files: File[]) => setFile(files[0])}
              ></Dropzone>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
