import { NextResponse } from 'next/server';
// Assuming db is from a library like @vercel/postgres or similar
import { db } from '@/lib/db';

// Define the shape of the data returned to the frontend
interface AppliedJobRow {
  application_id: number;
  application_status: string;
  applied_date: Date;
  job_id: number;
  job_title: string;
  job_location: string;
  job_type: string;
  role_category: string;
  salary_min?: number;
  salary_max?: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // The frontend sends ?userId=123
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // UPDATED QUERY:
    // 1. Switched `ja.created_at` to `j.created_at` (to fix your error)
    // 2. Added `j.company_name` (optional, if your table has it)
    const query = `
      SELECT 
        ja.id AS application_id,
        ja.status AS application_status,
        j.created_at AS applied_date, 
        j.id AS job_id,
        j.title AS job_title,
        j.location AS job_location,
        j.job_type,
        j.role_category,
        j.salary_min,
        j.salary_max
      FROM job_applications ja
      INNER JOIN jobs j ON ja.job_id = j.id
      WHERE ja.candidate_id = $1
      ORDER BY j.created_at DESC
    `;

    // Execute query
    const result = await db.query(query, [userId]);
    
    // FIX: Type Assertion added here
    // We explicitly tell TypeScript that 'result.rows' matches our interface
    const rows = result.rows as AppliedJobRow[];

    return NextResponse.json(rows);

  } catch (error) {
    console.error("Fetch Applied Jobs Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}