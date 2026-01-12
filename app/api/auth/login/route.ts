import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { createSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();

    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !user.password_hash) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Check Password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    // Enforce Role
    if (user.role !== role) {
      return NextResponse.json({ error: `Please log in as a ${user.role}` }, { status: 403 });
    }

    await createSession(user.id, user.role);

    const redirectUrl = role === 'employer' ? '/employer/dashboard' : '/dashboard';
    return NextResponse.json({ success: true, redirectUrl });

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}