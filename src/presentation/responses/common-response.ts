export class ApiResponse {
  static success<T>(message: string, data?: T) {
    return {
      success: true,
      message,
      data,
    };
  }
  static error(code: string, message: string) {
    return { success: false, error: { code, message } };
  }
}
