export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const TOKEN_KEY = 'token';
export const USER_KEY = 'user';

export const ERROR_CODES = {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
};