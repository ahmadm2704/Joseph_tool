import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, meetingDate, meetingTime, isGeneralQuery } = body;

    if (!email || !meetingDate || !meetingTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

    if (!clientId || !clientSecret || !refreshToken) {
      console.error('[schedule-meeting] Missing OAuth2 credentials in .env.local');
      return NextResponse.json(
        { error: 'Google OAuth2 credentials are not configured. Please run the one-time auth setup.' },
        { status: 500 }
      );
    }

    // Initialize OAuth2 client with the admin's credentials
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, `${baseUrl}/api/auth/google/callback`);
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Parse meetingTime like "10:00 AM" → 24-hour hours/minutes
    const timeMatch = meetingTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
    let hours = 0;
    let minutes = 0;
    if (timeMatch) {
      hours = parseInt(timeMatch[1], 10);
      minutes = parseInt(timeMatch[2], 10);
      const ampm = timeMatch[3].toUpperCase();
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
    }

    const startDateTimeStr = `${meetingDate}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    
    // We append 'Z' just to use Date for reliable 1-hour addition without local timezone messing it up
    const startUTCForMath = new Date(`${startDateTimeStr}Z`);
    const endUTCForMath = new Date(startUTCForMath.getTime() + 60 * 60 * 1000);
    const endDateTimeStr = endUTCForMath.toISOString().substring(0, 19);

    const summaryTitle = isGeneralQuery ? `General Query Meeting: ${firstName} ${lastName}` : `Admission Interview: ${firstName} ${lastName}`;
    const descriptionText = isGeneralQuery 
      ? `General query meeting with ${firstName} ${lastName} (${email}).`
      : `Admission interview with ${firstName} ${lastName} (${email}).`;

    // Full event with attendee + Google Meet link
    const event = {
      summary: summaryTitle,
      description: descriptionText,
      start: {
        dateTime: startDateTimeStr,
        timeZone: 'Europe/London',
      },
      end: {
        dateTime: endDateTimeStr,
        timeZone: 'Europe/London',
      },
      attendees: [
        { email: email, displayName: `${firstName} ${lastName}` },
      ],
      conferenceData: {
        createRequest: {
          requestId: `interview-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 30 },       // 30 min before
        ],
      },
    };

    console.log('[schedule-meeting] Creating event for:', email, meetingDate, meetingTime);

    const response = await calendar.events.insert({
      calendarId: calendarId,
      requestBody: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all', // Google sends calendar invite email to the student automatically
    });

    const meetLink = response.data.hangoutLink || '';
    const eventLink = response.data.htmlLink || '';

    console.log('[schedule-meeting] ✅ Event created. Meet link:', meetLink);

    // Format the date nicely for the email
    const formattedDate = new Date(meetingDate).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Send a custom confirmation email to the student via Nodemailer
    if (gmailUser && gmailAppPassword) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: gmailUser,
            pass: gmailAppPassword,
          },
        });

        const emailSubject = isGeneralQuery 
          ? `Your Meeting is Confirmed – ${formattedDate}` 
          : `Your Admission Interview is Confirmed – ${formattedDate}`;
          
        const emailTitle = isGeneralQuery ? 'Meeting Confirmed!' : 'Interview Confirmed!';
        const emailSubtitle = isGeneralQuery ? 'Your query meeting has been scheduled' : 'Your admission interview has been scheduled';
        const emailBody = isGeneralQuery 
          ? 'Great news! Your meeting has been confirmed. Please find the details below.'
          : 'Great news! Your admission interview has been confirmed. Please find the details below.';

        await transporter.sendMail({
          from: `"Course Admissions Team" <${gmailUser}>`,
          to: email,
          subject: emailSubject,
          html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);padding:36px 40px;text-align:center;">
            <div style="font-size:48px;margin-bottom:12px;">📅</div>
            <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">${emailTitle}</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">${emailSubtitle}</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 8px;color:#374151;font-size:16px;">Hi <strong>${firstName}</strong>,</p>
            <p style="margin:0 0 28px;color:#6b7280;font-size:15px;line-height:1.6;">
              ${emailBody}
            </p>

            <!-- Meeting Details Card -->
            <div style="background:#f8faff;border:2px solid #e0e7ff;border-radius:16px;padding:24px;margin-bottom:28px;">
              <p style="margin:0 0 16px;color:#4f46e5;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">📋 Meeting Details</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">
                    <span style="color:#9ca3af;font-size:13px;font-weight:600;">Date</span>
                  </td>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;text-align:right;">
                    <span style="color:#111827;font-size:13px;font-weight:700;">${formattedDate}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">
                    <span style="color:#9ca3af;font-size:13px;font-weight:600;">Time</span>
                  </td>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;text-align:right;">
                    <span style="color:#111827;font-size:13px;font-weight:700;">${meetingTime}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;">
                    <span style="color:#9ca3af;font-size:13px;font-weight:600;">Format</span>
                  </td>
                  <td style="padding:10px 0;text-align:right;">
                    <span style="color:#111827;font-size:13px;font-weight:700;">Google Meet (Online)</span>
                  </td>
                </tr>
              </table>
            </div>

            ${meetLink ? `
            <!-- Meet Button -->
            <div style="text-align:center;margin-bottom:28px;">
              <a href="${meetLink}" style="display:inline-block;background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:50px;font-weight:700;font-size:16px;box-shadow:0 4px 14px rgba(79,70,229,0.4);">
                🎥 Join Google Meet
              </a>
              <p style="margin:12px 0 0;color:#9ca3af;font-size:12px;">Or copy: <a href="${meetLink}" style="color:#4f46e5;">${meetLink}</a></p>
            </div>
            ` : ''}

            <!-- Tips -->
            <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:20px;margin-bottom:28px;">
              <p style="margin:0 0 10px;color:#92400e;font-size:13px;font-weight:700;">💡 Tips to prepare:</p>
              <ul style="margin:0;padding-left:18px;color:#78350f;font-size:13px;line-height:1.8;">
                <li>Test your camera and microphone before the call</li>
                <li>Find a quiet, well-lit space</li>
                <li>Have your documents ready to discuss</li>
                <li>Join 2-3 minutes early</li>
              </ul>
            </div>

            <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;">
              If you need to reschedule, please reply to this email.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="margin:0;color:#9ca3af;font-size:12px;">© ${new Date().getFullYear()} Course Admissions Team. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
          `,
        });

        // 2. Also send a notification to the admin
        const adminEmail = 'duna.jozef30@googlemail.com';
        const adminSubject = isGeneralQuery ? `📅 New General Meeting Scheduled: ${firstName} ${lastName}` : `📅 New Interview Scheduled: ${firstName} ${lastName}`;
        const adminHeading = isGeneralQuery ? 'New General Meeting Scheduled!' : 'New Interview Scheduled!';
        const adminDesc = isGeneralQuery ? 'Someone has scheduled a general query meeting.' : 'A student has scheduled their admission interview.';
        
        await transporter.sendMail({
          from: `"Course Registration System" <${gmailUser}>`,
          to: adminEmail,
          subject: adminSubject,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; border: 1px solid #e5e7eb; border-radius: 8px;">
              <h2 style="color: #4f46e5; margin-top: 0;">${adminHeading}</h2>
              <p>${adminDesc}</p>
              
              <div style="background: #f8faff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Student:</strong> ${firstName} ${lastName}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 5px 0;"><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>When:</strong><br/>${new Date(meetingDate).toLocaleDateString()} &middot; ${meetingTime} (UK Time)</p>
                <p style="margin: 5px 0;"><strong>Google Meet Link:</strong> <a href="${meetLink}">${meetLink}</a></p>
              </div>
              
              <p>This event has automatically been added to your Google Calendar.</p>
            </div>
          `,
        });

        console.log('[schedule-meeting] ✅ Confirmation email sent to student and admin');
      } catch (emailError: any) {
        console.error('[schedule-meeting] Email send failed:', emailError?.message);
      }
    } else {
      console.warn('[schedule-meeting] GMAIL_USER or GMAIL_APP_PASSWORD not set — skipping email.');
    }

    return NextResponse.json({ success: true, eventLink, meetLink });
  } catch (error: any) {
    console.error('[schedule-meeting] Error:', error?.message || error);
    return NextResponse.json(
      { error: error.message || 'Failed to schedule meeting' },
      { status: 500 }
    );
  }
}
