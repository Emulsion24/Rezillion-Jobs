import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId'); // Current candidate ID
    const search = searchParams.get('search') || '';
    const location = searchParams.get('location') || '';

    // Query to fetch active jobs + Company Name + Application Status
    let query = `
      SELECT 
        j.id,
        j.title,
        j.location,
        j.salary_min,
        j.salary_max,
        j.currency,
        j.job_type,
        j.skills,
        j.created_at,
        emp.company_name,
        -- Check if this specific user has applied
        EXISTS (
          SELECT 1 FROM job_applications ja 
          WHERE ja.job_id = j.id AND ja.candidate_id = $1
        ) as has_applied
      FROM jobs j
      LEFT JOIN employers emp ON j.employer_id = emp.user_id
      WHERE j.status = 'Active'
    `;

    const params: any[] = [userId ? parseInt(userId) : null];
    let paramIndex = 2;

    // Filter: Search Text (Title or Company)
    if (search) {
      query += ` AND (j.title ILIKE $${paramIndex} OR emp.company_name ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Filter: Location
    if (location) {
      query += ` AND j.location ILIKE $${paramIndex}`;
      params.push(`%${location}%`);
      paramIndex++;
    }

    query += ` ORDER BY j.created_at DESC`;

    const result = await db.query(query, params);

    return NextResponse.json(result.rows);

  } catch (error) {
    console.error("Fetch Jobs Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}