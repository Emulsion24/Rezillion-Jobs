import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { createSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    // 1. Query Database
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    // 2. Validate User & Password
    if (!user || !user.password_hash) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (user.role !== role) {
      return NextResponse.json({ error: `Please log in as a ${user.role}` }, { status: 403 });
    }

    // 3. Create Session
    await createSession(user.id, user.role);

    // --- FIX STARTS HERE ---
    
    // Log the raw user to see what the database is actually returning
    console.log("🔍 Raw DB User Object:", user); 

    // Manually map the fields to ensure 'name' exists
    const userPayload = {
        id: user.id,
        // Check standard column names, fallback to email prefix if all fail
        name: user.name || user.full_name || user.username || email.split('@')[0], 
        email: user.email,
        role: user.role
    };
    
    console.log("✅ Sending to Frontend:", userPayload);
    // --- FIX ENDS HERE ---

    const redirectUrl = role === 'employer' ? '/employer/dashboard' : '/dashboard';
    
    return NextResponse.json({ 
        success: true, 
        redirectUrl,
        user: userPayload // Send the fixed object
    });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}