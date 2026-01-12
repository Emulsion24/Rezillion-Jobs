import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createSession } from '@/lib/auth'; // Your session helper from previous steps

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    // 1. Find User
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 2. Validate Code
    if (user.is_verified) return NextResponse.json({ error: "Already verified" }, { status: 400 });
    if (user.verification_code !== code) return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    if (new Date() > new Date(user.verification_expires)) return NextResponse.json({ error: "Code expired" }, { status: 400 });

    // 3. Mark Verified & Clear Code
    await db.query(
      `UPDATE users SET is_verified = TRUE, verification_code = NULL, verification_expires = NULL WHERE id = $1`,
      [user.id]
    );

    // 4. Create Profile (The "Profile Created Successfully" step)
    // We retrieved full_name stored temporarily in users table or passed from front end. 
    // Assuming we added a temp `full_name` column to `users` in Step 1 or generic JSON column.
    // For this example, let's assume we pull `full_name` and `role` from the user record.
    
    if (user.role === 'employer') {
      await db.query(
        'INSERT INTO employers (user_id, company_name) VALUES ($1, $2) ON CONFLICT (user_id) DO NOTHING', 
        [user.id, user.full_name] // Using full_name as company name initially
      );
    } else {
      await db.query(
        'INSERT INTO candidates (user_id, full_name) VALUES ($1, $2) ON CONFLICT (user_id) DO NOTHING', 
        [user.id, user.full_name]
      );
    }

    // 5. Create Session (Login)
    await createSession(user.id, user.role);

    const redirectUrl = user.role === 'employer' ? '/employer/dashboard' : '/dashboard';
    return NextResponse.json({ success: true, redirectUrl });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}