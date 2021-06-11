export interface IResponse<T> {
  data: T;
  meta: {
    status_code: number;
    error_message?: string;
  };
}
