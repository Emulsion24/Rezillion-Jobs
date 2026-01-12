import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // Await cookies() for Next.js 15 compatibility
  const cookieStore = await cookies();
  
  // Delete the session token (ensure this matches the name used in your login/verify logic)
  cookieStore.delete('session_token');

  return NextResponse.json({ success: true });
}