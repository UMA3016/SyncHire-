const Brevo = require('@getbrevo/brevo');

// Instantiate the Transactional Emails API client
const apiInstance = new Brevo.TransactionalEmailsApi();

// Configure the API key authentication
const apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY;

/**
 * Send an OTP verification email via Brevo SDK.
 * @param {string} toEmail  - Recipient email address
 * @param {string} otpCode  - The 6-digit OTP string
 */
const sendOTPEmail = async (toEmail, otpCode) => {
  const sendSmtpEmail = new Brevo.SendSmtpEmail();

  sendSmtpEmail.sender = {
    name: process.env.SENDER_NAME || 'SyncHire',
    email: process.env.SENDER_EMAIL,
  };

  sendSmtpEmail.to = [{ email: toEmail }];

  sendSmtpEmail.subject = 'SyncHire – Your Verification Code';

  sendSmtpEmail.htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f0f4f4;font-family:'Segoe UI',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr><td align="center">
      <table width="420" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,128,128,0.12);">

        <!-- Brand Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#008080,#006666);padding:32px 24px;text-align:center;">
            <div style="font-size:28px;margin-bottom:6px;">💼</div>
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">
              SyncHire
            </h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 32px 20px;text-align:center;">
            <p style="margin:0 0 8px;color:#333;font-size:16px;font-weight:600;">
              Your Verification Code
            </p>
            <p style="margin:0 0 28px;color:#666;font-size:13px;">
              Enter this code on the login screen to continue.
            </p>

            <!-- OTP Display Panel -->
            <div style="background:#f0fafa;border:2px dashed #008080;border-radius:12px;padding:20px;margin:0 auto;max-width:280px;">
              <span style="font-family:'Courier New',monospace;font-size:40px;font-weight:800;letter-spacing:14px;color:#008080;">
                ${otpCode}
              </span>
            </div>

            <p style="margin:24px 0 0;color:#999;font-size:12px;">
              This code expires in <strong style="color:#008080;">10 minutes</strong>.
              <br>If you didn't request this, please ignore this email.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafa;padding:16px 24px;text-align:center;border-top:1px solid #e8f0f0;">
            <p style="margin:0;color:#aaa;font-size:11px;">
              &copy; ${new Date().getFullYear()} SyncHire &bull; Powered by Brevo
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
  console.log('✅ Brevo email sent — messageId:', response.messageId);
  return response;
};

module.exports = sendOTPEmail;
