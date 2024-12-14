// Base URL của API
export const BASE_URL = "http://localhost:8080";

export const GRADING_URL = "http://localhost:8081";

// Các endpoint API
export const API_ENDPOINTS = {
  oauthGoogle: "/oauth2/authorization/google", 
  signInGoogle: "/api/auth/signingoogle", 
  refreshToken: "/api/auth/refresh-token", 
  getAllExams: "/api/exam/list", 
  vertification: "/api/auth/verify", 
  getAllPermissions: "/api/permission/get-all", 
  getAllRoles: "/api/role", 
  getRoleDetail: "/api/role-permission/", 
  getAllAccounts: "/api/account/", 
  getAllStudents: "/api/students/getall", 
  uploadStudents: "/api/students/import", 
  uploadProcess: "/api/students/upload-progress", 
  uploadStudentSources: "/api/upload/import", 
  uploadStudentSourceProcess: "/api/upload/progress",
  getSourcesByExamId: "/api/source/",
  getAllPermissionCategories: "/api/permission/category",
  createPermission: "/api/permission/create", 
  getPermissionDetail: "/api/permission/",
  updatePermission: "/api/permission/update", 
  deletePermission: "/api/permission/delete/",
  createRole: "/api/role/create", 
  updateRole: "/api/role/update",
  getRoleById: "/api/role/",
  deleteRole: "/api/role/delete/", 
  updateRolePermission: "/api/role-permission/update", 
  getAllOrganizations: "/api/organization",
  getOrganizationDetail: "/api/organization/", 
  createOrganization: "/api/organization/create",
  updateOrganization: "/api/organization/update", 
  deleteOrganization: "/api/organization/delete/", 
  getAllPosition: "/api/position", 
  getPositionDetail: "/api/position/",
  createPosition: "/api/position/create",
  updatePosition: "/api/position/update",
  deletePosition: "/api/position/delete/",

  //Exam
  getExamInfo: "/api/exam", 
  scoreOverview: "/api/score/getAll", 
  score: "/api/score", 
  scoreDetail: "/api/score-details/details",
  plagiarism: "/api/score/code-plagiarism",
  exportScore: "/api/score/export",
  createExam: "/api/exam/",


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
  createAiApiKeys: "/api/ai_api_keys",
  updateAiApiKey: "/api/ai_api_keys",
  deleteAIApiKey: "/api/ai_api_keys",
  getAIApiKeyDetail: "/api/ai_api_keys",
  getAllAINames: "/api/ai_api_keys/ai-names",

  //Log
  exportLog: "/api/log/export",

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
  calculateScores: "/api/postman-grading/calculate",

  //prompt ai
  showQuestionAskAi: "/api/aiprompt",
  updateQuestionAskAiContent: "/api/aiprompt",

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
  examCount: "/api/exam/count", 
  examcountByGradingAt: "/api/exam/countByGradingAt",
  examcountByGradingAtPassed: "/api/exam/countByGradingAtPassed",
  examCountByGradingAtPassedAndSemester: "/api/exam/countByGradingAtPassedAndSemester",
  totalStudents: "/api/score/total-students",
  studentsWithZeroScore: "/api/score/students-with-zero-score",
  studentsWithScoreGreaterThanZero: "/api/score/students-with-score-greater-than-zero",
  studentScores: "/api/score/student-scores",

  //analysis
  studentScoresBarChart: "/api/score/student-scores",
  analyzeLogOnePass: "/api/score/analyze-log-one-pass",
  analyzeLogAllPass: "/api/score/analyze-log-all-pass",
  analyzeLogEachTest: "/api/score/analyze-log-each-test",
  dropdownList: "/api/exam/list-exam-exampaper",

  //notification
  notification: "/api/notifications",
  grading : "/api/grading/exam"

};
