import type { ErrorResponse } from '@/models/globalInterfaces';

export const catchFetchError = <T>(
  promise: Promise<T>
): Promise<[undefined, T] | [ErrorResponse]> => {
  return promise
    .then((data) => {
      return [undefined, data] as [undefined, T];
    })
    .catch((err) => {
      const errorResponse: ErrorResponse = {
        status: err?.response?.status || 500,
        response: {
          data: err?.response?.data || {
            status: 'failed',
            message: err?.message || 'Network error',
            userMessage: '500',
          },
        },
      };
      return [errorResponse];
    });
};
