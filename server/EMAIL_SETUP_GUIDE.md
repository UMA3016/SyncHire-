/**
 * Email Service Setup Guide for Mini Job Portal
 * 
 * The application now supports TWO email services:
 * 1. Brevo (Recommended - Better for transactional emails)
 * 2. Gmail/Nodemailer (Fallback - Already configured)
 * 
 * ============================================
 * OPTION 1: BREVO (Recommended)
 * ============================================
 * 
 * Brevo provides better deliverability for transactional emails like OTPs.
 * 
 * Steps:
 * 1. Sign up for free at: https://www.brevo.com
 * 2. Verify your email address
 * 3. Go to Settings → API Keys (https://app.brevo.com/settings/keys/api)
 * 4. Create a new API key (keep it safe!)
 * 5. Update .env with:
 *    BREVO_API_KEY=your_generated_api_key_here
 *    SENDER_EMAIL=jobportal3016@gmail.com
 *    SENDER_NAME=Mini Job Portal
 * 
 * Cost: FREE for up to 300 emails/day
 * 
 * ============================================
 * OPTION 2: GMAIL/NODEMAILER (Current Setup)
 * ============================================
 * 
 * Already configured but needs verification:
 * 
 * Steps:
 * 1. Gmail Account: jobportal3016@gmail.com ✓ (already set)
 * 2. Enable 2-Factor Authentication on your Gmail account:
 *    - Go to: https://myaccount.google.com/security
 *    - Enable 2-Step Verification
 * 3. Generate App Password:
 *    - Go to: https://myaccount.google.com/apppasswords
 *    - Select: Mail & Windows Computer
 *    - Google will generate a 16-character password
 *    - Copy and update .env: EMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
 * 4. Test by sending OTP to yourself
 * 
 * Note: The space in "xxfz txot cmgz rodr" is normal - Gmail app passwords include spaces.
 * 
 * ============================================
 * AUTO-FALLBACK SYSTEM
 * ============================================
 * 
 * The email service automatically:
 * 1. Tries Brevo FIRST (if BREVO_API_KEY is set)
 * 2. Falls back to Gmail/Nodemailer if Brevo fails or key is not set
 * 3. Logs which service was used
 * 
 * This ensures emails ALWAYS get sent, even if one service is down.
 * 
 * ============================================
 * TESTING THE EMAIL SERVICE
 * ============================================
 * 
 * 1. Start the server:
 *    npm run dev
 * 
 * 2. In the browser, go to: http://localhost:3000/login
 * 
 * 3. Try login with any email address and role (candidate/recruiter)
 * 
 * 4. Check server logs for messages like:
 *    ✅ [Brevo] OTP email sent successfully — messageId: ...
 *    OR
 *    ✅ [Gmail/Nodemailer] OTP email sent successfully — messageId: ...
 * 
 * 5. Check the email you provided - OTP should arrive within 30 seconds
 * 
 * ============================================
 * TROUBLESHOOTING
 * ============================================
 * 
 * Issue: "Email service failed"
 * → Check .env has correct EMAIL_APP_PASSWORD (without extra spaces at start/end)
 * → Verify Gmail 2FA and App Password are set up correctly
 * → Check if the Gmail account is NOT blocking "less secure apps"
 * 
 * Issue: OTP not arriving
 * → Check spam/junk folder
 * → Try the other email service by setting BREVO_API_KEY
 * → Check server logs for exact error message
 * 
 * Issue: Brevo API Key invalid
 * → Re-check API key at: https://app.brevo.com/settings/keys/api
 * → Make sure to copy the FULL key without spaces
 * → Verify you're using the correct environment (.env in /server folder)
 * 
 * ============================================
 * FILE LOCATIONS
 * ============================================
 * 
 * Email Service: server/utils/sendOTPEmailService.js
 * Used in: server/controllers/authController.js (line 3)
 * Config: server/.env (lines 6-11)
 * 
 * ============================================
 */

// For testing, you can import the service directly:
// const sendOTPEmail = require('./utils/sendOTPEmailService');
// await sendOTPEmail('test@example.com', '123456');
