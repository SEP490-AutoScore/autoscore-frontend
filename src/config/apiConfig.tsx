// Base URL của API
export const BASE_URL = "http://localhost:8080";

// Các endpoint API
export const API_ENDPOINTS = {
  oauthGoogle: "/oauth2/authorization/google", // Đăng nhập Google OAuth
  signInGoogle: "/api/auth/signingoogle",      // API lấy thông tin JWT
  refreshToken: "/api/auth/refresh-token",     // API refresh token
  getAllExams: "/api/exam/list",              // API lấy danh sách exams
};