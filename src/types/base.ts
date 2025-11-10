export interface IPagination<T> {
  current_page: number;
  limit: number;
  total_data: number;
  total_page: number;
  data: T;
}
