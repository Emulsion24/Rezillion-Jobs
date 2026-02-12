import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// 1. Define Types for Data Integrity
interface CourseRequestRow {
  id: number;
  title: string;
  description: string;
  target_audience: string; // Crucial for your dynamic logic
  thumbnail_url: string | null;
  notes_url: string | null;
  questions_url: string | null;
  user_id: number;
}

interface ApprovalRequestBody {
  id: number;
  action: 'approve' | 'reject';
  finalVideoUrl?: string; 
}

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000 
});

// --- GET: Fetch Pending Requests ---
export async function GET() {
  let client;
  try {
    client = await pool.connect();
    
    const query = `
      SELECT 
        cr.*, 
        u.full_name as creator_name,
        u.email as creator_email
      FROM public.course_requests cr
      LEFT JOIN public.users u ON cr.user_id = u.id
      WHERE cr.status = 'pending'
      ORDER BY cr.created_at DESC
    `;
    
    const res = await client.query(query);
    
    return NextResponse.json({ requests: res.rows });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("🔴 API GET Error:", errorMessage);
    return NextResponse.json({ requests: [], error: errorMessage }, { status: 500 }); 
  } finally {
    if (client) client.release();
  }
}

// --- PUT: Approve or Reject ---
export async function PUT(req: Request) {
  let client;
  try {
    const body = (await req.json()) as ApprovalRequestBody;
    const { id, action, finalVideoUrl } = body; 
    
    client = await pool.connect();
    await client.query('BEGIN'); 

    if (action === 'approve') {
      // 1. Update Request Status
      await client.query(
        "UPDATE public.course_requests SET status = 'approved', final_video_url = $1 WHERE id = $2",
        [finalVideoUrl, id]
      );

      // 2. Fetch Request Data
      // We type the query result to CourseRequestRow so 'r.target_audience' is recognized
      const reqData = await client.query<CourseRequestRow>("SELECT * FROM public.course_requests WHERE id = $1", [id]);
      
      if (reqData.rows.length > 0) {
        const r = reqData.rows[0];
        
        // 3. Insert into Public Library using the DYNAMIC target_audience ($3)
        const insertQuery = `
          INSERT INTO public.content_library 
          (title, description, target_audience, video_url, thumbnail_url, notes_url, questions_url, creator_id) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;
        
        await client.query(insertQuery, [
          r.title, 
          r.description, 
          r.target_audience, // Dynamic audience from DB
          finalVideoUrl, 
          r.thumbnail_url, 
          r.notes_url || null, 
          r.questions_url || null, 
          r.user_id
        ]);
      }
    } else {
      // Reject Logic
      await client.query("UPDATE public.course_requests SET status = 'rejected' WHERE id = $1", [id]);
    }

    await client.query('COMMIT'); 
    return NextResponse.json({ success: true });

  } catch (err: unknown) {
    if (client) await client.query('ROLLBACK');
    
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("🔴 API PUT Error:", errorMessage);
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}