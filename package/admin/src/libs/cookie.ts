import Cookies from "js-cookie";

export const AUTHORIZATION_TOKEN_KEY = "__kogen_admin_token";
export const AUTHORIZATION_TOKEN_EXPIRATION = 14; //
export const AUTHRIZATION_TOKEN_WITHOUT_AUTO_LOGIN = undefined;
const allowSecure = process.env.NODE_ENV !== "development";
const COOKIE_OPTION_FOR_TOKEN = {
  domain: process.env.NEXT_PUBLIC_KOGEN_DOMAIN,
  secure: allowSecure,
  sameSite: "strict",
} as const;

export const getTokenCookie = (): string | undefined => {
  return Cookies.get(AUTHORIZATION_TOKEN_KEY);
};

export const setTokenCookie = (
  token: string,
  expiration: number | undefined
) => {
  return Cookies.set(AUTHORIZATION_TOKEN_KEY, token, {
    expires: expiration,
    ...COOKIE_OPTION_FOR_TOKEN,
  });
};

export const deleteTokenCookie = () => {
  localStorage.removeItem(AUTHORIZATION_TOKEN_KEY);
  return Cookies.remove(AUTHORIZATION_TOKEN_KEY);
};
