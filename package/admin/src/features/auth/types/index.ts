export type LoginModel = {
  email: string;
  password: string;
};

export type LoginResponse = {
  data: UserModel;
};

export interface TokenModel {
  token: string;
}

export interface UserModel {
  // id: number;
  _id: string;
  fullName: string;
  role: string;
  email: string;
  is_actived: boolean;
  token: string;
  created_at: Date;
  updated_at: Date;
}
export interface paginationModel {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}
export interface UsersResponseModel {
  users: UserModel[];
  pagination: paginationModel;
}
export interface UserResponse {
  message: string;
  user: UserModel;
}
export class User {
  data: UserModel;

  constructor(user: UserModel) {
    this.data = user;
  }
}

export interface OldApiToken {
  response: {
    token: string;
  };
}
