import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SVGProps } from "react";
import { JSX } from "react/jsx-runtime";

interface FileUploadProps {
  value: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FileUpload({ value, onChange }: FileUploadProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col gap-1 p-6 items-center">
          {value ? (
            <img
              alt="Product image"
              className="aspect-square rounded-md object-cover"
              height="100"
              src={URL.createObjectURL(value)}
              width="100"
            />
          ) : (
            <>
              <FileIcon className="w-12 h-12" />
              <span className="text-sm font-medium text-gray-500">
                Drag and drop a file or click to browse
              </span>
              <span className="text-xs text-gray-500">
                PDF, image, video, or audio
              </span>
            </>
          )}
        </div>
        <div className="space-y-2 text-sm">
          <Label htmlFor="file" className="text-sm font-medium">
            File
          </Label>
          <Input
            className="dark:file:text-white"
            id="file"
            type="file"
            placeholder="File"
            accept="image/*"
            onChange={onChange}
          />
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

function FileIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

// function XIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M18 6 6 18" />
//       <path d="m6 6 12 12" />
//     </svg>
//   );
// }
