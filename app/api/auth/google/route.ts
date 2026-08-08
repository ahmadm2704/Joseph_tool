import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json({ error: 'GOOGLE_OAUTH_CLIENT_ID is not set in .env.local' }, { status: 500 });
  }

  // Use the configured app URL — works for both localhost and production
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ].join(' '),
    access_type: 'offline',
    prompt: 'consent',
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return NextResponse.redirect(authUrl);
}
