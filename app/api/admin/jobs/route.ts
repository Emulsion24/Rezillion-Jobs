import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET() {
  const client = await pool.connect();
  const res = await client.query("SELECT * FROM govt_jobs ORDER BY created_at DESC");
  client.release();
  return NextResponse.json(res.rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  const client = await pool.connect();
  
  try {
    await client.query(
      `INSERT INTO govt_jobs (title, organization, job_type, deadline, official_link, notification_file_url)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [body.jobTitle, body.organization, body.type, body.deadline, body.link, body.fileUrl]
    );
    return NextResponse.json({ success: true });
  } catch(e) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const client = await pool.connect();
  await client.query("DELETE FROM govt_jobs WHERE id = $1", [id]);
  client.release();
  return NextResponse.json({ success: true });
}