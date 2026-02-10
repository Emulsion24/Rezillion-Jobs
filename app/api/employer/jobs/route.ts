import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// 1. UPDATE INTERFACE to match Frontend Payload (employer_id)
interface JobPostRequestBody {
  employer_id: string | number; // <--- CHANGED FROM employerId
  title: string;
  roleCategory: string;
  department?: string;
  location: string;
  workMode?: string;
  type?: string;
  experience?: string;
  currency?: string;
  salaryMin?: string;
  salaryMax?: string;
  deadline?: string;
  skills?: string;
  description?: string;
  requirements?: string;
  benefits?: string;
}

interface JobDbRow {
  id: number;
  title: string;
  role_category: string;
  location: string;
  job_type: string;
  status: string;
  created_at: Date;
  applicants_count: string;
}



// GET: Fetch Jobs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const employerId = searchParams.get('employerId') || searchParams.get('employer_id');

    // FIX: Check if employerId is missing OR if it is the string "undefined"
    if (!employerId || employerId === 'undefined' || employerId === 'null') {
      // Return an empty array instead of an error if you want the UI to just show nothing
      // Or return 400 if strictly required. Here we return 400.
      return NextResponse.json({ error: "Valid Employer ID required" }, { status: 400 });
    }

    const query = `
      SELECT 
        j.id,
        j.title,
        j.role_category,
        j.location,
        j.job_type,
        j.status,
        j.created_at,
        COUNT(ja.id) as applicants_count
      FROM jobs j
      LEFT JOIN job_applications ja ON j.id = ja.job_id
      WHERE j.employer_id = $1
      GROUP BY j.id
      ORDER BY j.created_at DESC
    `;

    // Ensure we parse it to an integer before sending to DB to be safe
    const idAsInt = parseInt(employerId);

    if (isNaN(idAsInt)) {
        return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const result = await db.query(query, [idAsInt]);
    const rows = result.rows;

    return NextResponse.json(rows);

  } catch (error) {
    console.error("Fetch Jobs Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// ... (Keep POST function exactly as is) ...

// POST: Create Job
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as JobPostRequestBody;
    
    // 2. DESTRUCTURE employer_id (snake_case)
    const { 
      employer_id, // <--- MATCHING THE FRONTEND KEY
      title, roleCategory, department, location, workMode,
      type, experience, currency, salaryMin, salaryMax, 
      deadline, skills, description, requirements, benefits
    } = body;

     console.log("Received Payload:", { employer_id, title, location }); // Debug Log

    if (!employer_id || !title || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const skillsArray = skills 
      ? skills.split(',').map(s => s.trim()).filter(s => s.length > 0) 
      : [];

    const query = `
      INSERT INTO jobs (
        employer_id, title, role_category, department, location, work_mode, 
        job_type, experience_level, currency, salary_min, salary_max, 
        deadline, skills, description, requirements, benefits
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id, title, role_category, location, job_type, status, created_at
    `;

    const values = [
      employer_id, // <--- Using the snake_case variable
      title, 
      roleCategory, 
      department || null, 
      location, 
      workMode || 'On-Site',
      type || 'Permanent', 
      experience || 'Entry Level', 
      currency || 'INR', 
      salaryMin ? parseFloat(salaryMin) : null, 
      salaryMax ? parseFloat(salaryMax) : null,
      deadline || null, 
      skillsArray, 
      description || null, 
      requirements || null, 
      benefits || null
    ];

    const result = await db.query(query, values);

    return NextResponse.json({ 
      success: true, 
      message: "Job posted successfully",
      job: result.rows[0] as JobDbRow
    });

  } catch (error) {
    console.error("Post Job Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}