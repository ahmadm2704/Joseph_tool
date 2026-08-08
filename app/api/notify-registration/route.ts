import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, courseId } = body;

    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
    const adminEmail = 'duna.jozef30@googlemail.com';

    if (!gmailUser || !gmailAppPassword) {
      console.warn('[notify-registration] Gmail credentials not set, skipping email.');
      return NextResponse.json({ success: false, error: 'Gmail credentials missing' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    await transporter.sendMail({
      from: `"Course Registration System" <${gmailUser}>`,
      to: adminEmail,
      subject: `🚨 New Student Registration: ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #4f46e5; margin-top: 0;">New Student Registration! 🎉</h2>
          <p>A new student has just completed the registration form.</p>
          
          <div style="background: #f8faff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>
            <p style="margin: 5px 0;"><strong>Course ID:</strong> ${courseId}</p>
          </div>
          
          <p>You can view their full details and documents in your Admin Dashboard.</p>
          
          <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
            This is an automated notification from your Course Registration System.
          </div>
        </div>
      `,
    });

    console.log('[notify-registration] Admin notified about new registration:', email);
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('[notify-registration] Error sending email:', error?.message);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
