"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { File } from "lucide-react";

export function MessageFilePreview({
  fileName,
  fileType,
}: {
  fileName: string;
  fileType: string;
}) {
  const fileUploaded = fileName.split(".").pop()?.toLowerCase() as string;
  const imageTypes = ["jpg", "jpeg", "png", "webp", "gif"];
  const documentTypesPdf = ["pdf", "ppt", "pptx"];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="hover:cursor-pointer">
          {fileName}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-full">
        <DialogHeader>
          <DialogTitle className="text-center">Your File</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center items-center mt-4">
          {/* File preview */}
          {imageTypes.includes(fileUploaded) ? (
            <img
              src={fileType}
              alt="Image preview"
              className="max-w-[300px] max-h-[300px] rounded object-contain"
            />
          ) : documentTypesPdf.includes(fileUploaded) ? (
            <iframe
              src={fileType}
              title="Document preview"
              className="w-[460px] h-[600px] border rounded"
            />
          ) : fileName.endsWith(".docx") ? (
            <div className="max-h-[400px] w-[460px] overflow-auto border rounded p-4">
              <div dangerouslySetInnerHTML={{ __html: fileType }} />
            </div>
          ) : (
            <div>
              <File />
              <h1>{fileName}</h1>
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-center mt-4">
          <DialogClose asChild>
            <Button
              type="button"
              className="hover:cursor-pointer"
              variant="secondary"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MessageFilePreview;
