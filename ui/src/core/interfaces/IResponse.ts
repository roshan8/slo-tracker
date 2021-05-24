export interface IResponse<T> {
  data: T;
  meta: {
    status_code: number;
  };
}
