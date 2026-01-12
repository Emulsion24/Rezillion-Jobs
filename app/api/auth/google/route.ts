import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 1. Get role from the request URL
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role') || 'candidate'; 

  // 2. Validate Env Vars (Debugging helper)
  if (!process.env.GOOGLE_CLIENT_ID) {
    console.error("Missing GOOGLE_CLIENT_ID");
    return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
  }
  if (!process.env.NEXT_PUBLIC_APP_URL) {
     console.error("Missing NEXT_PUBLIC_APP_URL");
     return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;

  // 3. Construct URL parameters securely
  // URLSearchParams automatically encodes spaces and special characters
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    // Use standard OIDC scopes (simpler and less prone to errors)
    scope: 'openid email profile', 
    access_type: 'offline',
    prompt: 'consent',
    state: role, // Pass the role to the callback
  });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  return NextResponse.json({ url });
}