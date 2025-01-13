export interface ApiResponse<T> {
  success: boolean;
  title: string;
  message: string;
  data: T;
}
