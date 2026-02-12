import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

// GET: Fetch all active government jobs
export async function GET() {
  let client;
  try {
    client = await pool.connect();
    
    // We only fetch jobs where the deadline hasn't passed yet
    const query = `
      SELECT * FROM public.govt_jobs 
      WHERE deadline >= CURRENT_DATE 
      ORDER BY deadline ASC
    `;
    
    const res = await client.query(query);
    return NextResponse.json(res.rows);

  } catch (error: unknown) {
    // Fixed: Strict error typing instead of 'any'
    const errorMessage = error instanceof Error ? error.message : "Unknown database error";
    console.error("Govt Jobs API Error:", errorMessage);
    
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}