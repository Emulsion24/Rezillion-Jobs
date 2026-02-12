import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const audience = searchParams.get('audience'); // 'candidate' or 'employer'
  const search = searchParams.get('search');     // search keyword
  
  let client;
  try {
    client = await pool.connect();
    
    // Base query only pulls from the public approved library
    let query = `SELECT * FROM public.content_library`;
    const conditions: string[] = [];
    
    // Fixed: explicit type instead of any[]
    const values: string[] = []; 
    let paramIndex = 1;

    // 1. Mandatory Audience Filter
    if (audience) {
      conditions.push(`target_audience = $${paramIndex}`);
      values.push(audience);
      paramIndex++;
    }

    // 2. Optional Text Search (Fuzzy match on Title or Description)
    if (search) {
      conditions.push(`(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY created_at DESC`;
    
    const res = await client.query(query, values);
    return NextResponse.json(res.rows);

  } catch (error: unknown) {
    // Fixed: Strict error typing
    const errorMessage = error instanceof Error ? error.message : "Unknown API Error";
    console.error("Content API Error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}