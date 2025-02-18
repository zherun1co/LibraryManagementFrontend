export interface IDefaultResponse<T = any> {
    success: boolean;
    code: number;
    message: string;
    data: T;
  }