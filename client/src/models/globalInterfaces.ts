interface BaseResponse {
  status: string;
  message: string;
  userMessage: string;
}

export interface FetchResponse<T> extends BaseResponse {
  data: T;
}

interface SchemaErrors {
  field: string;
  message: string;
}

interface BaseResponseError extends BaseResponse {
  schemaErrors?: SchemaErrors[];
  errors?: unknown;
}

export interface ErrorResponse {
  status: number;
  response?: {
    data?: BaseResponseError;
  };
}
