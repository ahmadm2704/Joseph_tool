import sgMail from '@sendgrid/mail';

const sendgridApiKey = process.env.SENDGRID_API_KEY || '';
sgMail.setApiKey(sendgridApiKey);

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  const msg = {
    to,
    from: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'hello@coursepro.com', // MUST be a verified sender in SendGrid
    subject,
    text,
    html: html || text,
  };
  
  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('Error sending email via SendGrid:', error);
    return { success: false, error };
  }
};
