export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export const handleAuthError = (error: any) => {
  if (error.response?.status === 401) {
    return new AuthError(
      'Phiên đăng nhập hết hạn',
      'AUTH_EXPIRED',
      401
    );
  }
  // Xử lý các loại lỗi khác
}; 