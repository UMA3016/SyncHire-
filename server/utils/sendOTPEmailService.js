const nodemailer = require('nodemailer');

/**
 * Unified OTP Email Service
 * Sends OTP verification emails via Gmail SMTP
 */
const sendOTPEmail = async (toEmail, otpCode) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      throw new Error('Gmail credentials not configured (EMAIL_USER or EMAIL_APP_PASSWORD missing)');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD.trim(),
      },
      // Allow self-signed certificates for development
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify transporter connection
    await transporter.verify();
    console.log('✅ Gmail SMTP connection verified');

    const mailOptions = {
      from: `"Mini Job Portal" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Mini Job Portal – Your Verification Code',
      html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f0f4f4;font-family:'Segoe UI',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr><td align="center">
      <table width="420" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,128,128,0.12);">
        <tr>
          <td style="background:linear-gradient(135deg,#008080,#006666);padding:32px 24px;text-align:center;">
            <div style="font-size:28px;margin-bottom:6px;">💼</div>
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">
              Mini Job Portal
            </h1>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 32px 20px;text-align:center;">
            <p style="margin:0 0 8px;color:#333;font-size:16px;font-weight:600;">
              Your Verification Code
            </p>
            <div style="background:#f0fafa;border:2px dashed #008080;border-radius:12px;padding:20px;margin:24px auto;max-width:280px;">
              <span style="font-family:'Courier New',monospace;font-size:40px;font-weight:800;letter-spacing:14px;color:#008080;">
                ${otpCode}
              </span>
            </div>
            <p style="margin:24px 0 0;color:#999;font-size:12px;">
              This code expires in <strong style="color:#008080;">5 minutes</strong>.
              <br>If you didn't request this, please ignore this email.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f8fafa;padding:16px 24px;text-align:center;border-top:1px solid #e8f0f0;">
            <p style="margin:0;color:#aaa;font-size:11px;">
              &copy; ${new Date().getFullYear()} Mini Job Portal
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ [Gmail SMTP] OTP email sent successfully');
    console.log('   Recipient:', toEmail);
    console.log('   Message ID:', info.messageId);
    
    return { 
      success: true, 
      service: 'Gmail SMTP',
      messageId: info.messageId,
      recipient: toEmail 
    };
  } catch (error) {
    console.error('❌ [Gmail SMTP] Failed to send OTP email');
    console.error('   Error:', error.message);
    throw new Error(`Email service failed: ${error.message}`);
  }
};

module.exports = sendOTPEmail;

