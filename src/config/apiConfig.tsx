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
  getAllPermissions: "/api/permission/get-all", // API lấy danh sách permissions
  getAllRoles: "/api/role", // API lấy danh sách roles
  getRoleDetail: "/api/role-permission/", // API lấy danh sách permissions by role
  getAllAccounts: "/api/account/", // API lấy danh sách account
  getAllStudents: "/api/students/getall", // API lấy danh sách sinh viên
  uploadStudents: "/api/students/import", // API upload danh sách sinh viên
  uploadProcess: "/api/students/upload-progress", // API lấy tiền trình upload
  uploadStudentSources: "/api/upload/import", // API upload code student
  uploadStudentSourceProcess: "/api/upload/progress", // API lấy tiến trình upload code
  getSourcesByExamId: "/api/source/", // API lấy danh sách sources
  getAllPermissionCategories: "/api/permission/category", // API lấy danh sách permission categories
  createPermission: "/api/permission/create", // API tạo permission
  getPermissionDetail: "/api/permission/", // API lấy permission detail
  updatePermission: "/api/permission/update", // API update permission
  deletePermission: "/api/permission/delete/", // API delete permission
  createRole: "/api/role/create", // API tạo role
  updateRole: "/api/role/update", // API update role
  getRoleById: "/api/role/", // API lấy role detail
  deleteRole: "/api/role/delete/", // API delete role
  updateRolePermission: "/api/role-permission/update", // API update role permission
  getAllOrganizations: "/api/organization", // API lấy danh sách organizations
  getOrganizationDetail: "/api/organization/", // API lấy organization detail
  createOrganization: "/api/organization/create", // API tạo organization
  updateOrganization: "/api/organization/update", // API update organization
  deleteOrganization: "/api/organization/delete/", // API delete organization

  //Exam
  getExamInfo: "/api/exam", //get exam info
  scoreOverview: "/api/score/getAll", // API lấy danh sách bài thi đã có điểm
  score: "/api/score", // API lấy scores byExamPaperId
  scoreDetail: "/api/score-details/details",
  plagiarism: "/api/score/code-plagiarism",
  exportScore: "/api/score/export", // API export score byExamPaperId
  createExam: "/api/exam/",
  examCount: "/api/exam/count", 
  examcountByGradingAt: "/api/exam/countByGradingAt",
  examcountByGradingAtPassed: "/api/exam/countByGradingAtPassed", // API để lấy số lượng Exam có gradingAt đã vượt qua thời gian hiện tại
  examCountByGradingAtPassedAndSemester: "/api/exam/countByGradingAtPassedAndSemester",

  //Score
  topStudents: "/api/score/top-students", 


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
  deleteGherkin: "/api/gherkin_scenario/gherkinScenarioIds",
  createGherkin: "/api/gherkin_scenario",
  getGherkinById: "/api/gherkin_scenario",
  updateGherkin: "/api/gherkin_scenario",

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
  getPostmanById: "/api/postman-grading",
  updateExamQuestion: "/api/postman-grading/update-exam-question",
  saveCalculateScores: "/api/postman-grading/calculate-scores",
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

  //dashboard
  totalStudents: "/api/score/total-students",
  studentsWithZeroScore: "/api/score/students-with-zero-score",
  studentsWithScoreGreaterThanZero: "/api/score/students-with-score-greater-than-zero",
  studentScores: "/api/score/student-scores",

};
