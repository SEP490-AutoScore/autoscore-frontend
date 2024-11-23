// Base URL của API
export const BASE_URL = "http://localhost:8080";

// Các endpoint API
export const API_ENDPOINTS = {
  oauthGoogle: "/oauth2/authorization/google",   // Đăng nhập Google OAuth
  signInGoogle: "/api/auth/signingoogle",        // API lấy thông tin JWT
  refreshToken: "/api/auth/refresh-token",       // API refresh token
  getAllExams: "/api/exam/list",                 // API lấy danh sách exams
  vertification: "/api/auth/verify",             // API kiểm tra token
  getAllPermisisons: "/api/permission/get-all",  // API lấy danh sách permissions
  getAllRoles: "/api/role",                      // API lấy danh sách roles
  getRoleDetail: "/api/role-permission/",        // API lấy danh sách permissions by role
  getAllAccounts: "/api/account/",                // API lấy danh sách account

  //Exam
  getExamInfo: "/api/exam",                    //get exam info
  scoreOverview: "/api/score/getAll",          // API lấy danh sách bài thi đã có điểm
  score: "/api/score",                         // API lấy scores byExamPaperId
  exportScore: "/api/score/export",            // API export score byExamPaperId
  createExam: "/api/exam/",
  
  // Exam Database 
  importDatabase: "/api/database/import",
  changeDatabase: "/api/database/update",
  getDatabase: "/api/database/getbyExamPaperId",

  // Exam Question
  getlistIdQuestion: "/api/exam-paper/",
  getQuestions: "/api/exam-question/list",
  getQuestion: "/api/exam-question",

  // Gherkin
  generateGherkin: "/api/gherkin_scenario/generate_gherkin_format",
  getlistIdGherkin: "/api/exam-paper//gherkin-scenarios",
  gherkinScenarioPairs: "/api/gherkin_scenario/pairs?examPaperId=",
  gherkinScenarioPairsByQuestion: "/api/gherkin_scenario/pairs/by-question",
  

  // Postman
  importPostman: "/api/exam-paper/import-postman-collections",
  exportPostman: "/api/exam-paper/export-postman/",
  generatePostman: "/api/postman-grading/generate",
  mergePostman: "/api/postman-grading/merge/",

  //side
  getSubject: "/api/subject",
  getSemester: "/api/semester",

  //exam paper
  getExamPapers: "/api/exam-paper/list",
  getExamPaperInfo: "/api/exam-paper",

  //important
  getImportant : "/api/important",
};