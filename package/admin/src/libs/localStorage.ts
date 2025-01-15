"use client";
var ls = require("local-storage");
export const setToken = (token: string): void => {
  // localStorage.setItem("kogen_token", token);
  ls.set("_kogen_admin_token", token);
};

export const getToken = (): string | null => {
  const token = ls.get("_kogen_admin_token");
  return token ? token : null;
};

export const deleteToken = (): void => {
  ls.remove("_kogen_admin_token");
};
