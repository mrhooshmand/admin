// مسیرهای برنامه
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    USERS: '/users',
} as const;

export type RoutePath = typeof ROUTES[keyof typeof ROUTES];