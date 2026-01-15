import { NextResponse } from 'next/server';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    // 2. Parse the incoming form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null; // Strictly typed as File or null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 3. Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. Upload to Cloudinary using a Promise wrapper (Strictly Typed)
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'candidate_documents', 
          resource_type: 'auto',        
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result);
          } else {
            reject(new Error("Upload failed: No result returned from Cloudinary"));
          }
        }
      ).end(buffer);
    });

    // 5. Return the secure URL
    return NextResponse.json({ 
      success: true, 
      url: result.secure_url 
    });

  } catch (error) {
    // Narrow down the error type for logging
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Upload API Error:", errorMessage);
    
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}