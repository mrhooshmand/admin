import {ERROR_CODES} from '@/shared/constants/api';
import {toast} from 'sonner';


interface ErrorResponse {
    message: string;
    shouldLogout: boolean;
}

type AlertType = 'success' | 'error' | 'warning' | 'info';

/**
 * Handle API errors and regular errors
 */
export const handleApiError = (error: any): ErrorResponse => {
    // Check for empty or undefined error
    if (!error) {
        return {
            message: 'An unknown error occurred',
            shouldLogout: false
        };
    }

    // If input is a string
    if (typeof error === 'string') {
        const trimmedError = error.trim();
        if (trimmedError === '') {
            return {
                message: 'An unknown error occurred',
                shouldLogout: false
            };
        }
        return {
            message: trimmedError,
            shouldLogout: false
        };
    }

    // ✅ First check for response (Axios error)
    if (error.response) {
        const {status, data} = error.response;

        let errorMessage: string = '';

        if (typeof data === 'string') {
            errorMessage = data;
        } else if (typeof data === 'object' && data !== null) {
            errorMessage = data?.error || data?.message || data?.detail || '';
        }

        if (!errorMessage) {
            switch (status) {
                case 400:
                    errorMessage = 'Bad request';
                    break;
                case 401:
                    errorMessage = 'Invalid credentials';
                    break;
                case 403:
                    errorMessage = 'Access denied';
                    break;
                case 404:
                    errorMessage = 'Not found';
                    break;
                case 500:
                    errorMessage = 'Internal server error';
                    break;
                default:
                    errorMessage = `Error ${status}`;
            }
        }

        switch (status) {
            case ERROR_CODES.UNAUTHORIZED:
                return {
                    message: errorMessage || 'Session expired. Please sign in again',
                    shouldLogout: true
                };
            case ERROR_CODES.FORBIDDEN:
                return {
                    message: errorMessage || 'Access denied',
                    shouldLogout: false
                };
            case ERROR_CODES.NOT_FOUND:
                return {
                    message: errorMessage || 'Information not found',
                    shouldLogout: false
                };
            case ERROR_CODES.SERVER_ERROR:
                return {
                    message: errorMessage || 'Server error',
                    shouldLogout: false
                };
            default:
                return {
                    message: errorMessage || `Error with code ${status}`,
                    shouldLogout: false
                };
        }
    }

    // Check for request (no response)
    if (error.request) {
        return {
            message: 'Cannot connect to server',
            shouldLogout: false
        };
    }

    // Then check for Error object
    if (error instanceof Error) {
        return {
            message: error.message?.trim() || 'An unknown error occurred',
            shouldLogout: false
        };
    }

    // Default
    return {
        message: 'An unknown error occurred',
        shouldLogout: false
    };
};

/**
 * Main alert function
 */
export const showAlert = (type: AlertType, message: any, options: any = {}): void => {
    let finalMessage: string = message;

    if (message instanceof Error || message?.response) {
        const handled = handleApiError(message);
        finalMessage = handled.message;
    }

    if (typeof message === 'string' && message.trim() === '') {
        finalMessage = type === 'success' ? 'Operation completed successfully' : 'An error occurred';
    }

    if (!finalMessage || (typeof finalMessage === 'string' && finalMessage.trim() === '')) {
        finalMessage = type === 'success' ? 'Success' : 'Error';
    }

    switch (type) {
        case 'success':
            toast.success(finalMessage, options);
            break;
        case 'error':
            toast.error(finalMessage, options);
            break;
        case 'warning':
            toast.warning(finalMessage, options);
            break;
        case 'info':
            toast.info(finalMessage, options);
            break;
        default:
            toast(finalMessage, options);
    }
};

// ============ Helper functions ============

export const showSuccess = (message: string, options?: any): void =>
    showAlert('success', message, options);

export const showError = (error: any, options?: any): void =>
    showAlert('error', error, options);

export const showWarning = (message: string, options?: any): void =>
    showAlert('warning', message, options);

export const showInfo = (message: string, options?: any): void =>
    showAlert('info', message, options);
