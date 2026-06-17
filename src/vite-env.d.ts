/// <reference types="vite/client" />

// تعریف تایپ برای فایل‌های CSS
declare module '*.css' {
    const content: string;
    export default content;
}

// تعریف تایپ برای فایل‌های تصویری
declare module '*.png' {
    const content: string;
    export default content;
}

declare module '*.jpg' {
    const content: string;
    export default content;
}

declare module '*.svg' {
    const content: string;
    export default content;
}

interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}