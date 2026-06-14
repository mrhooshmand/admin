import {ERROR_CODES} from '../constants/api';
import {toast} from 'sonner';

export const handleApiError = (error) => {
    if (!error.response) {
        return {
            message: 'Error Connecting Server !',
            shouldLogout: false
        };
    }

    const {status, data} = error.response;

    switch (status) {
        case ERROR_CODES.UNAUTHORIZED:
            return {
                message: data?.error || 'Session Expired . Sign in Again',
                shouldLogout: true
            };

        case ERROR_CODES.FORBIDDEN:
            return {
                message: 'Access Denied',
                shouldLogout: false
            };

        case ERROR_CODES.NOT_FOUND:
            return {
                message: 'Information Not Found',
                shouldLogout: false
            };

        case ERROR_CODES.SERVER_ERROR:
            return {
                message: 'Server Error',
                shouldLogout: false
            };

        default:
            return {
                message: data?.error || 'Error!',
                shouldLogout: false
            };
    }
};

export const showError = (error) => {
    const {message} = handleApiError(error);
    toast.error(message);
};