import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// 1. Define Interface for POST Body
interface CourseRequestBody {
  userId: number;
  title: string;
  description: string;
  sourceVideoLink: string;
  targetAudience: string;
  thumbnailUrl?: string | null;
  notesUrl?: string | null;
  questionsUrl?: string | null;
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// --- GET: Fetch Creator's Submissions ---
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  
  let client;
  try {
    client = await pool.connect();
    
    // Safety check: prevent hanging loaders if ID is null
    if (!userId || userId === 'undefined') {
      return NextResponse.json({ requests: [] });
    }

    // Join with Users to get full_name
    const query = `
      SELECT cr.*, u.full_name as creator_name
      FROM public.course_requests cr
      LEFT JOIN public.users u ON cr.user_id = u.id
      WHERE cr.user_id = $1
      ORDER BY cr.created_at DESC
    `;
    
    const res = await client.query(query, [parseInt(userId)]);
    return NextResponse.json({ requests: res.rows || [] });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown API Error";
    console.error("🔴 API GET Error:", errorMessage);
    return NextResponse.json({ requests: [], error: errorMessage }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}

// --- POST: Submit New Course Request ---
export async function POST(req: Request) {
  let client;
  try {
    // Fix: Explicitly cast body to defined interface
    const body = (await req.json()) as CourseRequestBody;
    client = await pool.connect();

    // Updated Query to include 'target_audience'
    const query = `
      INSERT INTO public.course_requests (
        user_id, 
        title, 
        description, 
        source_video_link, 
        thumbnail_url, 
        notes_url, 
        questions_url,
        target_audience
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      body.userId, 
      body.title, 
      body.description, 
      body.sourceVideoLink,
      body.thumbnailUrl || null, 
      body.notesUrl || null, 
      body.questionsUrl || null,
      body.targetAudience // Mapped from the frontend selector
    ];

    const res = await client.query(query, values);
    
    console.log("✅ Course request saved for audience:", body.targetAudience);
    
    return NextResponse.json({ success: true, request: res.rows[0] });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown API Error";
    console.error("🔴 API POST Error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}