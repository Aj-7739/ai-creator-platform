// app/api/imagekit/upload/route.js
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getImageKit } from "../../../../lib/imagekit-server";

export async function POST(request) {
  try {
    // Clerk authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Lazy initialize ImageKit at runtime (safe for Vercel)
    const imagekit = getImageKit();

    // Get form data
    const formData = await request.formData();
    const file = formData.get("file");
    const fileName = formData.get("fileName");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Build unique filename
    const timestamp = Date.now();
    const sanitizedFileName =
      (fileName && fileName.toString().replace(/[^a-zA-Z0-9.-]/g, "_")) ||
      "upload";
    const uniqueFileName = `${userId}/${timestamp}_${sanitizedFileName}`;

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: uniqueFileName,
      folder: "/blog_images",
    });

    return NextResponse.json(
      {
        success: true,
        url: uploadResponse.url,
        fileId: uploadResponse.fileId,
        width: uploadResponse.width,
        height: uploadResponse.height,
        size: uploadResponse.size,
        name: uploadResponse.name,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("ImageKit upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload image",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
