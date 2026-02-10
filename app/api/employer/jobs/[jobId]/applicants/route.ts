import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface JobApplicationRow {
  id: string;
  name: string | null;
  email: string;
  location: string;
  skills: string[] | null;
  experience: string;
  appliedDate: string;
  status: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;

    if (!jobId) {
      return NextResponse.json({ error: "Job ID required" }, { status: 400 });
    }

    // UPDATED QUERY based on your Schema Image
    const query = `
      SELECT 
        u.id,
        c.full_name as name,           -- Get name from 'candidates' table
        u.email,
        -- Location is not in schema, checking if it's in candidates or defaulting
        COALESCE(c.additional_info, 'Remote') as location, 
        
        -- Skills is '_text' (array) in candidates
        c.skills, 
        
        -- Experience is jsonb, we'll just grab it or default to '0'
        -- You might need to parse this in frontend if it's a complex object
        'N/A' as experience,
        
        ja.status,
        ja.applied_at as "appliedDate" -- Schema uses 'applied_at', not 'created_at'
      FROM job_applications ja
      INNER JOIN users u ON ja.candidate_id = u.id
      LEFT JOIN candidates c ON u.id = c.user_id -- Join candidates via user_id
      WHERE ja.job_id = $1
      ORDER BY ja.applied_at DESC
    `;

    const result = await db.query(query, [jobId]);

    const applicants = (result.rows as JobApplicationRow[]).map((row: JobApplicationRow) => ({
      id: row.id,
      name: row.name || "Unknown Candidate", // Fallback if profile incomplete
      email: row.email,
      roleId: 'general', // Placeholder
      roleLabel: 'Applicant',
      location: row.location || 'Remote',
      experience: row.experience,
      // Check if skills is an array or string (Postgres _text returns array)
      skills: Array.isArray(row.skills) ? row.skills : [],
      availability: 'Immediate',
      rate: 'N/A',
      appliedDate: row.appliedDate ? new Date(row.appliedDate).toLocaleDateString() : 'N/A',
      status: row.status
    }));

    return NextResponse.json(applicants);

  } catch (error) {
    console.error("Fetch Applicants Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}