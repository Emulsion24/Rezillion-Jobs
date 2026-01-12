import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // true for port 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendVerificationEmail(to: string, code: string) {
  try {
    await transporter.sendMail({
      // IMPORTANT: The 'from' address MUST match the SMTP_USER address in Hostinger
      from: `"JobFlow Security" <${process.env.SMTP_USER}>`, 
      to,
      subject: 'Verify your JobFlow Account',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #333;">Welcome to JobFlow!</h2>
          <p>Please use the following code to verify your account:</p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; color: #000;">
            ${code}
          </div>
          <p style="margin-top: 20px; color: #666; font-size: 12px;">This code expires in 10 minutes.</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Email send failed:", error);
    return { success: false, error };
  }
}