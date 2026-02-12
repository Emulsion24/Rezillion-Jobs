import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// 1. Define Types
interface UploadRequestBody {
  title: string;
  description: string;
  targetAudience: string;
  videoLink: string;
  thumbnail: string | null;
  notes: string | null;
  questions: string | null;
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// --- GET: Fetch Content Library ---
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const audience = searchParams.get('audience'); // Optional filter

  const client = await pool.connect();
  try {
    let query = 'SELECT * FROM content_library ORDER BY created_at DESC';
    // Fix: Explicitly type the params array
    let params: string[] = [];

    if (audience) {
      query = 'SELECT * FROM content_library WHERE target_audience = $1 ORDER BY created_at DESC';
      params = [audience];
    }

    const res = await client.query(query, params);
    return NextResponse.json(res.rows);
  } catch (error: unknown) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  } finally {
    client.release();
  }
}

// --- POST: Master Upload (Admin uploads directly) ---
export async function POST(req: Request) {
  // Fix: Type the incoming body
  const body = (await req.json()) as UploadRequestBody;
  const client = await pool.connect();
  
  try {
    await client.query(
      `INSERT INTO content_library 
      (title, description, target_audience, video_url, thumbnail_url, notes_url, questions_url) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        body.title, 
        body.description, 
        body.targetAudience, // 'candidate' or 'employer'
        body.videoLink, 
        body.thumbnail || null, // Ensure null safety
        body.notes || null, 
        body.questions || null
      ]
    );
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    // Fix: Strict error handling
    const errorMessage = err instanceof Error ? err.message : "Unknown upload error";
    console.error(errorMessage);
    return NextResponse.json({ error: 'Upload Failed' }, { status: 500 });
  } finally {
    client.release();
  }
}

// --- DELETE: Remove Content ---
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query('DELETE FROM content_library WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("DELETE Error:", err);
    return NextResponse.json({ error: 'Delete Failed' }, { status: 500 });
  } finally {
    client.release();
  }
}