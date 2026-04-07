import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CustomInput } from "@/components/global/CustomInput";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { createLabResult, deleteFile } from "@/lib/api";
import { API_URL } from "@/lib/api";

const XRayUploadModal = ({ patientId }: { patientId: string }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const form = useForm({ defaultValues: { bodyPart: "", notes: "" } });

  const mutation = useMutation({
    mutationFn: createLabResult,
    onSuccess: () => {
      setOpen(false);
      toast.success("X-Ray recorded successfully");
      form.reset();
      setImageUrl("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to record X-Ray");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      setImageUrl("");
      toast.success("File deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete file");
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      toast.error("File size must be less than 4MB");
      return;
    }

    setUploading(true);
    try {
      const res = await fetch(
        `${API_URL}/upload?filename=${encodeURIComponent(file.name)}`,
        {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setImageUrl(data.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = (formData: any) => {
    if (!imageUrl) return toast.error("Please upload an image first");
    mutation.mutate({
      patientId,
      testType: "X-Ray",
      bodyPart: formData.bodyPart,
      imageUrl,
      aiAnalysis: "Processing...",
    });
  };

  const removeFile = () => {
    deleteMutation.mutate({ file: imageUrl });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <DialogTrigger asChild>
        <Button variant="outline">Upload X-Ray</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg card">
        <DialogHeader>
          <DialogTitle>Upload New X-Ray</DialogTitle>
        </DialogHeader>
        {!imageUrl ? (
          <div className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed border-slate-300 dark:border-slate-500 rounded-lg">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <p className="text-sm text-muted-foreground">
              {uploading ? "Uploading..." : "Upload an X-Ray image (max 4MB)"}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Choose File"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <img
                src={imageUrl}
                alt="Preview"
                className="h-full w-full object-contain"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                type="button"
                onClick={() => removeFile()}
                disabled={deleteMutation.isPending}
              >
                Remove
              </Button>
            </div>

            <form
              onSubmit={form.handleSubmit(handleSave)}
              className="space-y-3"
            >
              <CustomInput
                control={form.control}
                name="bodyPart"
                label="Body Part"
                placeholder="e.g. Left Knee"
                disabled={mutation.isPending}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending}
              >
                Save to Patient Record
              </Button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default XRayUploadModal;
