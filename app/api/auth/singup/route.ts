import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db'; // Your database connection
import { randomInt } from 'crypto';
import { sendVerificationEmail } from '@/lib/mail'; // The Hostinger mail helper

export async function POST(request: Request) {
  try {
    const { fullName, email, password, role } = await request.json();

    // 1. Check if user already exists
    const check = await db.query('SELECT id, is_verified FROM users WHERE email = $1', [email]);
    
    if (check.rows.length > 0) {
      const user = check.rows[0];
      // If they are already verified, stop them.
      if (user.is_verified) {
        return NextResponse.json(
          { error: "User already exists. Please login." }, 
          { status: 409 }
        );
      }
      // If they exist but are NOT verified (e.g., abandoned previous signup), 
      // we proceed to overwrite their details with the new request.
    }

    // 2. Generate a 6-Digit OTP Code
    const code = randomInt(100000, 999999).toString();
    
    // Set expiration to 10 minutes from now
    const expires = new Date(Date.now() + 10 * 60 * 1000); 

    // 3. Hash the Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Save to Database
    // We store the user with 'is_verified = FALSE'. 
    // We are NOT creating the Profile (Candidate/Employer) table yet. 
    // That happens only after they verify the code.
    
    if (check.rows.length === 0) {
      // NEW USER: Insert
      await db.query(
        `INSERT INTO users (email, password_hash, role, provider, verification_code, verification_expires, full_name, is_verified) 
         VALUES ($1, $2, $3, 'email', $4, $5, $6, FALSE)`,
        [email, hashedPassword, role, code, expires, fullName]
      );
    } else {
      // EXISTING UNVERIFIED USER: Update
      await db.query(
        `UPDATE users 
         SET password_hash=$1, role=$2, verification_code=$3, verification_expires=$4, full_name=$5 
         WHERE email=$6`,
        [hashedPassword, role, code, expires, fullName, email]
      );
    }

    // 5. Send Email via Hostinger
    const emailResult = await sendVerificationEmail(email, code);

    if (!emailResult.success) {
      // If email fails, return an error so the frontend stays on the form
      // and doesn't switch to the 'Enter Code' screen.
      return NextResponse.json(
        { error: "Failed to send verification email. Please check your email address." }, 
        { status: 500 }
      );
    }

    // 6. Success
    // We return the email so the frontend can display it (e.g. "Sent code to john@...")
    return NextResponse.json({ success: true, email });

  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}