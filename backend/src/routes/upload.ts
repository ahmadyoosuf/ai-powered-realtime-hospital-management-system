import express from "express";
import { put, del } from "@vercel/blob";
import { requireAuth } from "../middleware/auth";

const uploadRouter = express.Router();

// Upload a file to Vercel Blob
uploadRouter.post("/", requireAuth, async (req, res) => {
  try {
    const contentType = req.headers["content-type"] || "application/octet-stream";

    // Get filename from query param or header
    const filename = (req.query.filename as string) || `upload-${Date.now()}`;

    const blob = await put(filename, req, {
      access: "public",
      contentType,
    });

    res.json({ url: blob.url });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
});

// Delete a file from Vercel Blob
uploadRouter.delete("/", requireAuth, async (req, res) => {
  try {
    const { fileUrl } = req.body;
    if (!fileUrl) {
      return res.status(400).json({ message: "File URL is required" });
    }
    await del(fileUrl);
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default uploadRouter;
