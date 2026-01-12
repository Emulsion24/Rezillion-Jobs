import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createSession } from '@/lib/auth';

// Define the shape of the Google User data we expect
interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  picture: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const role = searchParams.get('state') || 'candidate'; // Default role if state is missing

  // 1. Handle "Access Denied" or Cancelled by user
  if (!code) {
    return NextResponse.redirect(new URL('/login?error=access_denied', request.url));
  }

  try {
    // 2. Exchange Code for Access Token
    const tokenParams = new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
      grant_type: 'authorization_code',
    });

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams,
    });

    const tokens = await tokenRes.json();

    if (!tokenRes.ok) {
      console.error("Google Token Error:", tokens);
      throw new Error('Failed to retrieve tokens from Google');
    }

    // 3. Get User Profile Data using the Access Token
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const googleUser = (await userRes.json()) as GoogleUser;

    if (!googleUser.email) {
      throw new Error('Google account does not have a verified email');
    }

    // 4. Database Logic: Check if User Exists
    const check = await db.query(
      'SELECT id, role, provider FROM users WHERE email = $1', 
      [googleUser.email]
    );

    let userId: number;
    let userRole = role; // Default to the role they selected on login screen

    if (check.rows.length > 0) {
      // --- USER EXISTS: LOGIN ---
      const existingUser = check.rows[0];
      userId = existingUser.id;
      userRole = existingUser.role; // Use their ACTUAL role from DB, ignoring what they clicked
      
      // Optional: Prevent email/password users from logging in via Google if you want strict separation
      // if (existingUser.provider === 'email') { ... }
    } else {
      // --- USER NEW: SIGNUP ---
      
      // A. Insert into USERS table
      const newUser = await db.query(
        `INSERT INTO users (email, provider, role, is_verified, full_name) 
         VALUES ($1, 'google', $2, TRUE, $3) 
         RETURNING id`,
        [googleUser.email, role, googleUser.name]
      );
      userId = newUser.rows[0].id;

      // B. Create specific PROFILE based on Role
      if (role === 'employer') {
        await db.query(
          `INSERT INTO employers (user_id, company_name) 
           VALUES ($1, $2) ON CONFLICT (user_id) DO NOTHING`,
          [userId, googleUser.name] // Using name as temp company name
        );
      } else {
        await db.query(
          `INSERT INTO candidates (user_id, full_name) 
           VALUES ($1, $2) ON CONFLICT (user_id) DO NOTHING`,
          [userId, googleUser.name]
        );
      }
    }

    // 5. Create Session Cookie (Login)
    await createSession(userId, userRole);

    // 6. Redirect to Dashboard
    const destination = userRole === 'employer' ? '/employer/dashboard' : '/dashboard';
    
    // IMPORTANT: We use NextResponse.redirect here
    return NextResponse.redirect(new URL(destination, request.url));

  } catch (error) {
    console.error("Callback Error:", error);
    // Redirect back to login with a visible error message
    return NextResponse.redirect(new URL('/login?error=google_auth_failed', request.url));
  }
}