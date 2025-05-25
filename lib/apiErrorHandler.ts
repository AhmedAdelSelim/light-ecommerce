export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const handleAPIError = (error: unknown) => {
  if (error instanceof APIError) {
    return {
      message: error.message,
      status: error.status,
      code: error.code
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500,
      code: 'UNKNOWN_ERROR'
    };
  }

  return {
    message: 'An unknown error occurred',
    status: 500,
    code: 'UNKNOWN_ERROR'
  };
};