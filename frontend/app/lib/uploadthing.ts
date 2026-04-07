import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

const uploadthingUrl = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/uploadthing`;

export const UploadButton = generateUploadButton({
  url: uploadthingUrl,
});
export const UploadDropzone = generateUploadDropzone({
  url: uploadthingUrl,
});
