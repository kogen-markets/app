import axios from "axios";
import { getTokenCookie, deleteTokenCookie } from "@/libs/cookie";
import { getToken } from "@/libs/localStorage";

const version = "v1";

export const client = axios.create({
  // baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${version}`,
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://w5zttn3gg4rbenncxt2uklpfiy0vjddx.lambda-url.us-east-1.on.aws/api"}/`,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use((config) => {
  const token = getTokenCookie();
  // const token = getToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      deleteTokenCookie();
    }
    throw error;
  }
);

export const fetcherWithTotal = (url: string) =>
  client.get(url).then((response) => {
    return response.data;
  });

export const fetcher = (url: string) =>
  client.get(url).then((response) => response.data);

export const LIMIT = 20;
export const DETAIL_PAGE_LIMIT = 5;

export const SELECT_LIST_LIMIT = 100000;
