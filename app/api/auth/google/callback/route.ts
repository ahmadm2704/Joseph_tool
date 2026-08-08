import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  if (error) {
    return new NextResponse(`
      <html><body style="font-family:sans-serif;padding:40px;background:#fef2f2;">
        <h2 style="color:#dc2626;">❌ Authorization Failed</h2>
        <p>Google returned an error: <strong>${error}</strong></p>
        <p>Please try again by visiting <a href="/api/auth/google">/api/auth/google</a></p>
      </body></html>
    `, { headers: { 'Content-Type': 'text/html' } });
  }

  if (!code) {
    return new NextResponse(`
      <html><body style="font-family:sans-serif;padding:40px;background:#fef2f2;">
        <h2 style="color:#dc2626;">❌ No Authorization Code</h2>
        <p>Google did not return a code. Please try again.</p>
      </body></html>
    `, { headers: { 'Content-Type': 'text/html' } });
  }

  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new NextResponse(`
      <html><body style="font-family:sans-serif;padding:40px;background:#fef2f2;">
        <h2 style="color:#dc2626;">❌ Missing Credentials</h2>
        <p>GOOGLE_OAUTH_CLIENT_ID or GOOGLE_OAUTH_CLIENT_SECRET not set in .env.local</p>
      </body></html>
    `, { headers: { 'Content-Type': 'text/html' } });
  }

  try {
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    const { tokens } = await oauth2Client.getToken(code);
    const refreshToken = tokens.refresh_token;

    if (!refreshToken) {
      return new NextResponse(`
        <html><body style="font-family:sans-serif;padding:40px;background:#fffbeb;">
          <h2 style="color:#d97706;">⚠️ No Refresh Token Returned</h2>
          <p>Google didn't return a refresh token. This usually happens if you've authorized this app before.</p>
          <p>To fix: Go to <a href="https://myaccount.google.com/permissions" target="_blank">Google Account Permissions</a>, remove this app, then <a href="/api/auth/google">try again</a>.</p>
        </body></html>
      `, { headers: { 'Content-Type': 'text/html' } });
    }

    return new NextResponse(`
      <html>
      <head><title>Authorization Successful</title></head>
      <body style="font-family:'Segoe UI',sans-serif;padding:40px;background:#f0fdf4;max-width:700px;margin:0 auto;">
        <div style="background:white;border-radius:16px;padding:32px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <div style="text-align:center;margin-bottom:24px;">
            <div style="font-size:48px;margin-bottom:8px;">✅</div>
            <h1 style="color:#166534;margin:0;font-size:24px;">Authorization Successful!</h1>
            <p style="color:#4b5563;margin-top:8px;">Copy the refresh token below and add it to your .env.local file.</p>
          </div>
          
          <div style="background:#f9fafb;border:2px solid #e5e7eb;border-radius:12px;padding:20px;margin-bottom:24px;">
            <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Your Refresh Token</p>
            <code style="display:block;background:#1e293b;color:#a3e635;padding:16px;border-radius:8px;font-size:13px;word-break:break-all;line-height:1.6;">${refreshToken}</code>
          </div>

          <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:20px;">
            <p style="margin:0 0 12px;font-weight:700;color:#1d4ed8;">📋 Steps to complete setup:</p>
            <ol style="margin:0;padding-left:20px;color:#374151;line-height:2;">
              <li>Open your <strong>.env.local</strong> file</li>
              <li>Find <code style="background:#e5e7eb;padding:2px 6px;border-radius:4px;">GOOGLE_REFRESH_TOKEN=</code></li>
              <li>Paste the token above as its value (inside the quotes)</li>
              <li>Save the file and <strong>restart npm run dev</strong></li>
            </ol>
          </div>

          <div style="margin-top:20px;padding:16px;background:#fef3c7;border:1px solid #fde68a;border-radius:12px;">
            <p style="margin:0;font-size:13px;color:#92400e;">⚠️ <strong>Keep this secret!</strong> Never share or commit this token to Git.</p>
          </div>
        </div>
      </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html' } });
  } catch (err: any) {
    return new NextResponse(`
      <html><body style="font-family:sans-serif;padding:40px;background:#fef2f2;">
        <h2 style="color:#dc2626;">❌ Token Exchange Failed</h2>
        <p>${err?.message || 'Unknown error'}</p>
      </body></html>
    `, { headers: { 'Content-Type': 'text/html' } });
  }
}
