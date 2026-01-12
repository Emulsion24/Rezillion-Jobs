import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createSession } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const role = searchParams.get('state'); // Retrieve role passed from Step 1

  if (!code) return NextResponse.redirect(new URL('/login?error=no_code', request.url));

  try {
    // 1. Exchange Code for Tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`,
        grant_type: 'authorization_code',
      }),
    });
    const tokens = await tokenRes.json();

    // 2. Get User Info from Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const googleUser = await userRes.json();

    // 3. Check Database
    const check = await db.query('SELECT * FROM users WHERE email = $1', [googleUser.email]);
    let userId;
    let userRole = role;

    if (check.rows.length > 0) {
      // User exists - Login
      const existingUser = check.rows[0];
      userId = existingUser.id;
      userRole = existingUser.role; // Use existing role, ignore state
    } else {
      // User New - Signup
      // Insert into Users
      const newUser = await db.query(
        `INSERT INTO users (email, provider, role) VALUES ($1, 'google', $2) RETURNING id`,
        [googleUser.email, role]
      );
      userId = newUser.rows[0].id;

      // Insert into Profile based on Role
      if (role === 'employer') {
        await db.query('INSERT INTO employers (user_id, company_name) VALUES ($1, $2)', [userId, googleUser.name]);
      } else {
        await db.query('INSERT INTO candidates (user_id, full_name) VALUES ($1, $2)', [userId, googleUser.name]);
      }
    }

    // 4. Create Session
    await createSession(userId, userRole as string);

    // 5. Redirect
    const destination = userRole === 'employer' ? '/employer/dashboard' : '/dashboard';
    return NextResponse.redirect(new URL(destination, request.url));

  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL('/login?error=server_error', request.url));
  }
}