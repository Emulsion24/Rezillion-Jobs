import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET() {
  const client = await pool.connect();
  try {
    // Run counts in parallel for performance
    const [employee, employer, jobs, requests] = await Promise.all([
      client.query("SELECT COUNT(*) FROM content_library WHERE target_audience = 'employee'"),
      client.query("SELECT COUNT(*) FROM content_library WHERE target_audience = 'employer'"),
      client.query("SELECT COUNT(*) FROM govt_jobs WHERE status = 'Active'"),
      client.query("SELECT COUNT(*) FROM course_requests WHERE status = 'pending'")
    ]);

    return NextResponse.json({
      employeeCount: employee.rows[0].count,
      employerCount: employer.rows[0].count,
      jobCount: jobs.rows[0].count,
      pendingRequests: requests.rows[0].count
    });
  } catch (error) {
    return NextResponse.json({ error: 'Database Error' }, { status: 500 });
  } finally {
    client.release();
  }
}