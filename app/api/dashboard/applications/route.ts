import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// 1. Strict Interface matching the SQL Query result
interface AppliedJobRow {
  application_id: number;
  application_status: string;
  applied_date: string;
  job_id: number;
  job_title: string;
  company_name: string; // Now fetched from the users table
  job_location: string;
  job_type: string;
  role_category: string;
  salary_min?: number;
  salary_max?: number;
}

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  let client;

  try {
    client = await pool.connect();

    // UPDATED QUERY:
    // 1. JOIN 'jobs' with 'users' using 'employer_id'
    // 2. Select 'u.full_name' as the company_name
    const query = `
      SELECT 
        ja.id AS application_id,
        ja.status AS application_status,
        ja.applied_at AS applied_date, 
        j.id AS job_id,
        j.title AS job_title,
        u.full_name AS company_name, 
        j.location AS job_location,
        j.job_type,
        j.role_category,
        j.salary_min,
        j.salary_max
      FROM public.job_applications ja
      INNER JOIN public.jobs j ON ja.job_id = j.id
      LEFT JOIN public.users u ON j.employer_id = u.id
      WHERE ja.candidate_id = $1
      ORDER BY ja.applied_at DESC
    `;

    const result = await client.query(query, [userId]);
    
    const rows = result.rows as AppliedJobRow[];

    return NextResponse.json(rows);

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown server error";
    console.error("Fetch Applied Jobs Error:", errorMessage);
    
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}