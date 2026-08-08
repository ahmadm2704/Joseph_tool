import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@coursepro.com';
    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

    // Verify current password
    if (currentPassword !== adminPassword) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters.' }, { status: 400 });
    }

    // Save new password to Supabase admin_settings table
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase.from('admin_settings').upsert({ key: 'admin_password', value: newPassword }, { onConflict: 'key' });
      } catch (e) {
        console.warn('[change-password] Supabase update notice:', e);
      }
    }

    // Send confirmation email to admin
    if (gmailUser && gmailAppPassword) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: gmailUser, pass: gmailAppPassword },
      });

      await transporter.sendMail({
        from: `"CoursePro Security" <${gmailUser}>`,
        to: adminEmail,
        subject: '⚠️ Admin Password Changed Successfully',
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#1e293b 0%,#4338ca 100%);padding:40px 32px;text-align:center;">
      <div style="width:60px;height:60px;background:rgba(255,255,255,0.15);border-radius:16px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
        <span style="font-size:28px;">🔐</span>
      </div>
      <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700;">Password Changed</h1>
      <p style="color:rgba(255,255,255,0.75);margin:8px 0 0;font-size:14px;">Admin Security Notification</p>
    </div>
    <div style="padding:32px;">
      <p style="color:#374151;font-size:15px;margin:0 0 20px;">Your admin password has been successfully updated. Here are the details:</p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="margin:0 0 8px;font-size:13px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Admin Account</p>
        <p style="margin:0 0 12px;color:#1e293b;font-size:15px;font-weight:600;">${adminEmail}</p>
        <p style="margin:0 0 8px;font-size:13px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">New Password</p>
        <p style="margin:0;color:#4f46e5;font-size:18px;font-weight:700;letter-spacing:0.05em;background:#eef2ff;padding:10px 16px;border-radius:8px;display:inline-block;">${newPassword}</p>
      </div>
      <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:12px;padding:16px;margin-bottom:24px;">
        <p style="margin:0;color:#92400e;font-size:14px;"><strong>⚠️ Security Tip:</strong> If you did not make this change, please contact your system administrator immediately.</p>
      </div>
      <p style="color:#94a3b8;font-size:13px;text-align:center;margin:0;">Changed on ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London', dateStyle: 'full', timeStyle: 'short' })} (UK Time)</p>
    </div>
  </div>
</body>
</html>`,
      });
    }

    return NextResponse.json({ success: true, message: 'Password changed successfully!' });
  } catch (err: any) {
    console.error('[change-password] Error:', err);
    return NextResponse.json({ error: 'Failed to change password.' }, { status: 500 });
  }
}
