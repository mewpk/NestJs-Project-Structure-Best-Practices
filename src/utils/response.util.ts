export interface SuccessResponse<T> {
    status: 'success';
    message?: string;
    data: T;
}

export interface ErrorResponse {
    status: 'error';
    message: string;
    errorCode?: string;
}

export const successResponse = <T>(data: T, message: string = 'Success'): SuccessResponse<T> => {
    return {
        status: 'success',
        message,
        data,
    };
};

export const errorResponse = (message: string, errorCode?: string): ErrorResponse => {
    return {
        status: 'error',
        message,
        errorCode,
    };
};
