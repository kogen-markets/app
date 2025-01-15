export interface BaseResponse<D = undefined, M = undefined> {
  status: number;
  message: string;
  forceLogout: boolean;
  data: D;
  meta: M;
  error?: string;
  exception?: object;
}

export interface PaginationMetaModel {
  pagination: PaginationModel;
  totalPages: number;
}

export interface PaginationModel {
  count: number;
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}
