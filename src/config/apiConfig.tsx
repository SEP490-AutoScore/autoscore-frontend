// Base URL của API
export const BASE_URL = "http://localhost:8080";

export const GRADING_URL = "http://localhost:8081";

// Các endpoint API
export const API_ENDPOINTS = {
  oauthGoogle: "/oauth2/authorization/google", // Đăng nhập Google OAuth
  signInGoogle: "/api/auth/signingoogle", // API lấy thông tin JWT
  refreshToken: "/api/auth/refresh-token", // API refresh token
  getAllExams: "/api/exam/list", // API lấy danh sách exams
  vertification: "/api/auth/verify", // API kiểm tra token
  getAllPermisisons: "/api/permission/get-all", // API lấy danh sách permissions
  getAllRoles: "/api/role", // API lấy danh sách roles
  getRoleDetail: "/api/role-permission/", // API lấy danh sách permissions by role
  getAllAccounts: "/api/account/", // API lấy danh sách account
  getAllStudents: "/api/students/getall", // API lấy danh sách sinh viên
  uploadStudents: "/api/students/import", // API upload danh sách sinh viên
  uploadProcess: "/api/students/upload-progress", // API lấy tiền trình upload
  uploadStudentSources: "/api/upload/import", // API upload code student
  uploadStudentSourceProcess: "/api/upload/progress", // API lấy tiến trình upload code
  getSourcesByExamId: "/api/source/", // API lấy danh sách sources

  //Exam
  getExamInfo: "/api/exam", //get exam info
  scoreOverview: "/api/score/getAll", // API lấy danh sách bài thi đã có điểm
  score: "/api/score", // API lấy scores byExamPaperId
  scoreDetail: "/api/score-details/details",
  plagiarism: "/api/score/code-plagiarism",
  exportScore: "/api/score/export", // API export score byExamPaperId
  createExam: "/api/exam/",

  // Exam Database 
  importDatabase: "/api/database/import",
  changeDatabase: "/api/database/update",
  getDatabase: "/api/database/getbyExamPaperId",

  // Exam Question
  getQuestions: "/api/exam-question/list",
  getQuestion: "/api/exam-question",

  // API Key
  updateSelectedKey: "/api/ai_api_keys/update-selected-key",
  aiApiKeys: "/api/ai_api_keys",

  showQuestionAskAi: "/api/content",
  createAiApiKeys: "/api/ai_api_keys",
  updateAiApiKey: "/api/ai_api_keys",

  // Gherkin
  generateGherkin: "/api/gherkin_scenario/generate_gherkin_format",
  generateGherkinMore: "/api/gherkin_scenario/generate_gherkin_format_more",
  getlistIdGherkin: "/api/exam-paper//gherkin-scenarios",
  gherkinScenarioPairs: "/api/gherkin_scenario/pairs?examPaperId=",
  gherkinScenarioPairsByQuestion: "/api/gherkin_scenario/pairs/by-question",
  deleteGherkin: "/api/gherkin_scenario",
  createGherkin: "/api/gherkin_scenario",

  // Postman
  importPostman: "/api/exam-paper/import-postman-collections",
  exportPostman: "/api/exam-paper/export-postman",
  generatePostman: "/api/postman-grading/generate",
  generatePostmanMore: "/api/postman-grading/generate-more",
  mergeFilePostman: "/api/postman-grading/merge",
  postmanGrading: "/api/postman-grading",
  updatePostmanGrading: "/api/postman-grading",
  importPostmanCollections: "/api/exam-paper/import-postman-collections",
  deletePostman: "/api/postman-grading",
  infoFilePostmanExamPaper: "/api/exam-paper/infoFilePostman",
  confirmFilePostman: "/api/exam-paper/confirmFilePostman",

  //side
  getSubject: "/api/subject",
  getSemester: "/api/semester",

  //exam paper
  getExamPapers: "/api/exam-paper/list",
  getExamPaperInfo: "/api/exam-paper",
  getListExamPaper: "/api/exam-paper/all",

  //important
  getImportant: "/api/important",

  exportWord: "/api/document/generate-word",
  getSources: "/api/source",
  getStudent: "/api/students",
};
