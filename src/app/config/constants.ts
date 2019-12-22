// Environments
export const API_URL_DEV = 'http://146.83.109.228:3300/';
export const API_URL_PROD = 'http://...';
export const API_URL = API_URL_DEV;

// Endpoints
export const API = {
   LOGIN: `${API_URL}login`,
   REGISTER: `${API_URL}register`,
   RENEW_TOKEN: `${API_URL}renew_token`,
   UPDATE_SESSION: `${API_URL}update_session`,
   LOGOUT: ``,
   FILE: `${API_URL}files`,
   USERS: `${API_URL}users`,
   USER_COUNT: `${API_URL}users/count`,
   // User-Course (Enrollment)
   ENROLLMENTS: `${API_URL}enrollments`,
   ACTIVITIES: `${API_URL}activities`,

   //CALENDARIO
   CALENDARS: `${API_URL}calendars`,
   CALENDARS_AS_SELECT_OPTION: `${API_URL}calendars/select_options`,
   CALENDAR_COUNT: `${API_URL}calendars/count`,
   //CURSOS
   COURSES: `${API_URL}courses`,
   COURSES_SEARCH: `${API_URL}courses/search`,
   COURSES_AS_SELECT_OPTION: `${API_URL}courses/select_options`,
   //ASIGNATURAS
   SUBJECTS: `${API_URL}subjects`,
   SUBJECTS_AS_SELECT_OPTION: `${API_URL}subjects/select_options`,
   SUBJECT_COUNT: `${API_URL}subjects/count`,
   //CATEGORIAS
   CATEGORIES: `${API_URL}categories`,
   CATEGORIES_AS_SELECT_OPTION: `${API_URL}categories/select_options`,
   CATEGORIES_LAST: `${API_URL}categories/last`,
   CATEGORY_COUNT: `${API_URL}categories/count`, //elimninar
   //SUBCATEGORÍAS
   SUBCATEGORIES: `${API_URL}subcategories`,
   SUBCATEGORIES_AS_SELECT_OPTION: `${API_URL}subcategories/select_options`,
   SUBCATEGORY_COUNT: `${API_URL}subcategories/count`,
   SUBCATEGORIES_LAST: `${API_URL}subcategories/last`,

   QUESTIONS: `${API_URL}questions`,
   USER_QUESTION_CLASS: `${API_URL}user_question_class`,
   LESSON_QUESTIONS: `${API_URL}lesson_questions`,
   MODULES: `${API_URL}modules`,
   UPLOAD_IMAGE: `${API_URL}image/`,
   WORKSPACES: `${API_URL}workspaces`,
   STATISTICS: `${API_URL}statistics`
};

// User roles
export const ROLES = [
   { role: 1, name: 'Administrador', url: 'admin' },
   { role: 2, name: 'Profesor', url: 'teacher' },
   { role: 3, name: 'Estudiante', url: 'student' },
];

//RECURSOS
export const IMAGE_SERVER = '';

// Form errors
export const ERROR_FORMS = {
   TOKEN_INVALID: 'El token de sesión es inválido.',
   SERVER_ERROR: 'Tenemos algunos problemas con nuestros servidores en este momento.'
}

export const PAGE_TITLES = {
   '/': { title: 'Inicio' },
   'admin': { title: 'Inicio' },
   'teacher': { title: 'Inicio' },
   'student': { title: 'Inicio' },
   'profile': { title: 'Perfil de Usuario' },
   'admin.(user)': { title: 'Usuarios' },
   'admin.(subject)': { title: 'Asignaturas' },
   'admin.(calendar)': { title: 'Calendario' }
};

// Pagination
export const DEFAULT_PAGE_SIZE = 5;
export const PAGE_SIZES = [20, 50, 100];

// Question difficulties
export const DIFFICULTIES = [
   { difficulty: 1, name: 'Fácil' },
   { difficulty: 2, name: 'Media' },
   { difficulty: 3, name: 'Díficil' }
];

// Image extensions allowed
export const IMAGE_EXTS = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];

