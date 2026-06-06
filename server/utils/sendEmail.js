const nodemailer = require('nodemailer');

const sendEmail = async (toEmail, otpCode) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Mini Job Portal" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Your Mini Job Portal OTP',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #E6F2F2; padding: 40px; text-align: center;">
        <div style="background-color: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto;">
          <h2 style="color: #008080; margin-top: 0;">MJP Verification</h2>
          <p style="color: #64748B; font-size: 16px;">Use the OTP below to complete your verification.</p>
          <div style="font-size: 32px; font-weight: bold; color: #1E293B; letter-spacing: 4px; margin: 24px 0; padding: 16px; background-color: #F8FAFC; border-radius: 8px; border: 1px dashed #008080;">
            ${otpCode}
          </div>
          <p style="color: #94A3B8; font-size: 14px;">This code expires in 5 minutes.</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
