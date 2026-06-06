import API from './api';

/** POST /api/auth/signup — New user registration */
export const signup = async (name, email, phone, password, confirmPassword, role) => {
  const response = await API.post('/auth/signup', { name, email, phone, password, confirmPassword, role });
  return response.data;
};

/** POST /api/auth/verify-signup-otp — Verify OTP during signup */
export const verifySignupOTP = async (email, otpCode) => {
  const response = await API.post('/auth/verify-signup-otp', { email, otpCode });
  return response.data;
};

/** POST /api/auth/login — Traditional login with email and password */
export const login = async (email, password) => {
  const response = await API.post('/auth/login', { email, password });
  return response.data;
};

/** POST /api/auth/forgot-password-request — Request password reset OTP */
export const forgotPasswordRequest = async (email) => {
  const response = await API.post('/auth/forgot-password-request', { email });
  return response.data;
};

/** POST /api/auth/reset-password — Reset password with OTP */
export const resetPassword = async (email, otpCode, newPassword, confirmPassword) => {
  const response = await API.post('/auth/reset-password', { email, otpCode, newPassword, confirmPassword });
  return response.data;
};

/** GET /api/auth/me — Fetch authenticated user profile */
export const me = async () => {
  const response = await API.get('/auth/me');
  return response.data;
};

/** PUT /api/auth/profile — Update candidate profile */
export const updateProfile = async (formData) => {
  const response = await API.put('/auth/profile', formData);
  return response.data;
};
/** PUT /api/auth/update-password — Update password */
export const updatePassword = async (currentPassword, newPassword) => {
  const response = await API.put('/auth/update-password', { currentPassword, newPassword });
  return response.data;
};

/** PUT /api/auth/update-email — Update email */
export const updateEmail = async (newEmail) => {
  const response = await API.put('/auth/update-email', { newEmail });
  return response.data;
};
