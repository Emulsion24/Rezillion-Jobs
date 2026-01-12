import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

export async function createSession(userId: number, role: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(secret);

  // We still try to set it here for normal cases
  (await cookies()).set('session_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // CHANGED FROM 'strict' TO 'lax' FOR GOOGLE LOGIN
        maxAge: 7200, 
        path: '/',
    });

  // IMPORTANT: Return the token so we can attach it to redirects manually
  return token; 
}