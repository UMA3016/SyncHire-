const nodemailer = require('nodemailer');

const sendStatusEmail = async (toEmail, candidateName, jobTitle, companyName, status, interviewDetails = {}) => {
  console.log(`[Email Service] Preparing to send '${status}' email to ${toEmail}...`);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD.trim(),
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let subject = '';
  let messageBody = '';

  switch (status) {
    case 'Applied':
      subject = `Application Received: ${jobTitle} at ${companyName}`;
      messageBody = `
        <h2 style="color: #008080;">Application Successful</h2>
        <p>Hi ${candidateName},</p>
        <p>Thank you for applying for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.</p>
        <p>Your application has been received and is currently under review by the recruitment team. You can track the progress of your application on your SyncHire Pipeline dashboard.</p>
      `;
      break;

    case 'Shortlisted':
      subject = `Good News! You've been Shortlisted for ${jobTitle}`;
      messageBody = `
        <h2 style="color: #008080;">You're Shortlisted! 🎉</h2>
        <p>Hi ${candidateName},</p>
        <p>Congratulations! Your profile has been shortlisted for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.</p>
        <p>The recruitment team will reach out to you shortly with the next steps. Keep an eye on your inbox and your SyncHire dashboard.</p>
      `;
      break;

    case 'Interview Call Received':
      subject = `Interview Scheduled: ${jobTitle} at ${companyName}`;
      messageBody = `
        <h2 style="color: #008080;">Interview Scheduled 📅</h2>
        <p>Hi ${candidateName},</p>
        <p>Great news! An interview has been scheduled for your application for the <strong>${jobTitle}</strong> role at <strong>${companyName}</strong>.</p>
        <div style="background-color: #F8FAFC; border-left: 4px solid #008080; padding: 16px; margin: 20px 0;">
          <p style="margin: 0 0 8px;"><strong>Date:</strong> ${interviewDetails.interviewDate || 'TBA'}</p>
          <p style="margin: 0 0 8px;"><strong>Time:</strong> ${interviewDetails.interviewTime || 'TBA'}</p>
          <p style="margin: 0;"><strong>Link/Location:</strong> <a href="${interviewDetails.interviewLink || '#'}" style="color: #008080;">${interviewDetails.interviewLink || 'TBA'}</a></p>
        </div>
        <p>Please ensure you join a few minutes early. Good luck!</p>
      `;
      break;

    case 'Selection Confirmed':
      subject = `Congratulations! You are Selected for ${jobTitle}`;
      messageBody = `
        <h2 style="color: #008080;">You're Hired! 🥳</h2>
        <p>Hi ${candidateName},</p>
        <p>We are thrilled to inform you that you have been selected for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>!</p>
        <p>The HR team will be in touch with you shortly regarding your offer letter and onboarding process. Welcome aboard!</p>
      `;
      break;

    case 'Rejected':
      subject = `Update on your application for ${jobTitle}`;
      messageBody = `
        <h2 style="color: #64748B;">Application Update</h2>
        <p>Hi ${candidateName},</p>
        <p>Thank you for taking the time to apply for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong> and for your interest in joining the team.</p>
        <p>While your profile is impressive, the team has decided to move forward with other candidates whose qualifications more closely match the current requirements of the role.</p>
        <p>We wish you the best of luck in your job search and future endeavors!</p>
      `;
      break;

    default:
      return; // Do not send email for unknown status
  }

  const mailOptions = {
    from: `"SyncHire" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: subject,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; background-color: #F1F5F9; padding: 40px 20px; color: #1E293B;">
        <div style="background-color: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 32px; margin-bottom: 10px;">💼</div>
            <h1 style="color: #008080; margin: 0; font-size: 24px;">SyncHire</h1>
          </div>
          
          ${messageBody}

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #E2E8F0; text-align: center; font-size: 12px; color: #94A3B8;">
            <p>This is an automated message from the SyncHire platform. Please do not reply directly to this email.</p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Status Email Sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send status email:', error);
  }
};

module.exports = sendStatusEmail;
