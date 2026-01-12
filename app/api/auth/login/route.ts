import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { createSession } from '@/lib/auth';

export async function POST(request: Request) {
  console.log("🚀 Login API called"); // Log 1: Confirm route is hit

  try {
    // 1. Parse Body
    const body = await request.json();
    const { email, password, role } = body;
    console.log("📝 Request Payload:", { email, role, hasPassword: !!password }); // Log 2: Check inputs

    if (!email || !password || !role) {
      console.log("❌ Missing fields");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 2. Database Query
    console.log("🔍 Querying Database for:", email);
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    console.log("✅ DB Result Rows:", result.rows.length); // Log 3: Did DB connect?

    const user = result.rows[0];

    // 3. User Check
    if (!user || !user.password_hash) {
      console.log("❌ User not found or no password hash");
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 4. Password Check
    console.log("🔐 Verifying password...");
    const isValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isValid) {
      console.log("❌ Password mismatch");
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 5. Role Check
    if (user.role !== role) {
      console.log(`❌ Role Mismatch: User is ${user.role}, tried to login as ${role}`);
      return NextResponse.json({ error: `Please log in as a ${user.role}` }, { status: 403 });
    }

    // 6. Session Creation
    console.log("🍪 Creating session for User ID:", user.id);
    await createSession(user.id, user.role);

    const redirectUrl = role === 'employer' ? '/employer/dashboard' : '/dashboard';
    console.log("🎉 Login Successful! Redirecting to:", redirectUrl);
    
    return NextResponse.json({ success: true, redirectUrl });

  } catch (error: any) {
    // CRITICAL: This log will appear in Vercel "Functions" logs
    console.error("🔥 LOGIN API CRASHED:", error);
    
    // Return the actual error message temporarily so you can see it in the browser console response
    return NextResponse.json({ 
      error: "Server Error", 
      details: error.message 
    }, { status: 500 });
  }
}