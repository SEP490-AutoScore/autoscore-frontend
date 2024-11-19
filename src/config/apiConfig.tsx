// Base URL của API
export const BASE_URL = "http://localhost:8080";

// Các endpoint API
export const API_ENDPOINTS = {
  oauthGoogle: "/oauth2/authorization/google", // Đăng nhập Google OAuth
  signInGoogle: "/api/auth/signingoogle",      // API lấy thông tin JWT
  refreshToken: "/api/auth/refresh-token",     // API refresh token
  getAllExams: "/api/exam/list",              // API lấy danh sách exams
  vertification: "/api/auth/verify",          // API kiểm tra token


  //Exam
  getExamInfo: "/api/exam",    //get exam info
  getAllExams: "/api/exam/list",              // API lấy danh sách exams
  scoreOverview: "/api/score/getAll",          // API lấy danh sách bài thi đã có điểm
  score: "/api/score",                         // API lấy scores byExamPaperId
  
  // Exam Database 
  importDatabase: "/api/database/import",
  changeDatabase: "/api/database/update",

  // Exam Question
  getlistIdQuestion: "/api/exam-paper//questions",

  // Gherkin
  generateGherkin: "/api/gherkin_scenario/generate_gherkin_format",
  getlistIdGherkin: "/api/exam-paper//gherkin-scenarios",

  // Postman
  importPostman: "/api/exam-paper/import-postman-collections",
  exportPostman: "/api/exam-paper/export-postman/",
  generatePostman: "/api/postman-grading/generate/",
  mergePostman: "/api/postman-grading/merge/",
};