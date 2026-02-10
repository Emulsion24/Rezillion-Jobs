import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, jobId } = body;

    if (!userId || !jobId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Insert application (The UNIQUE constraint we created earlier prevents duplicates)
    const query = `
      INSERT INTO job_applications (job_id, candidate_id, status)
      VALUES ($1, $2, 'New')
      ON CONFLICT (job_id, candidate_id) DO NOTHING
      RETURNING id;
    `;

    const result = await db.query(query, [jobId, userId]);

    if (result.rowCount === 0) {
      return NextResponse.json({ message: "Already applied" }, { status: 200 });
    }

    return NextResponse.json({ success: true, message: "Application submitted" });

  } catch (error) {
    console.error("Apply Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}