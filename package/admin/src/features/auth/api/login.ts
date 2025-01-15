"use client";

import { LoginModel, LoginResponse } from "@/features/auth/types";
import { client } from "@/libs/axios";

export const loginWithEmailAndPassword = async (
  data: LoginModel
): Promise<{ data: LoginResponse }> => {
  const response = await client.post<LoginResponse>("/admin/login", {
    ...data,
  });
  return { data: response.data };
};
