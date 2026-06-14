
import { ERROR_CODES } from '../constants/api';

export const handleApiError = (error) => {
    if (!error.response) {
        return {
            message: 'ارتباط با سرور برقرار نیست. لطفاً دوباره تلاش کنید.',
            shouldLogout: false
        };
    }

    const { status, data } = error.response;

    switch (status) {
        case ERROR_CODES.UNAUTHORIZED:
            return {
                message: data?.error || 'نشست شما منقضی شده است. لطفاً دوباره وارد شوید.',
                shouldLogout: true
            };

        case ERROR_CODES.FORBIDDEN:
            return {
                message: 'شما دسترسی به این بخش را ندارید.',
                shouldLogout: false
            };

        case ERROR_CODES.NOT_FOUND:
            return {
                message: 'اطلاعات درخواستی یافت نشد.',
                shouldLogout: false
            };

        case ERROR_CODES.SERVER_ERROR:
            return {
                message: 'خطایی در سرور رخ داده است. لطفاً دقایقی دیگر تلاش کنید.',
                shouldLogout: false
            };

        default:
            return {
                message: data?.error || 'خطایی رخ داده است. لطفاً دوباره تلاش کنید.',
                shouldLogout: false
            };
    }
};

export const showError = (error) => {
    const { message } = handleApiError(error);
    alert(message);
};