"use client";

import React, { useEffect, useState } from "react";

import { SubmitHandler, useForm } from "react-hook-form";

import { loginWithEmailAndPassword } from "@/features/auth/api/login";
import { LoginModel, User } from "@/features/auth/types";
import { LoginFormComponent } from "@/features/auth/components/signin/sign.form";
import {
  setTokenCookie,
  AUTHORIZATION_TOKEN_EXPIRATION,
} from "@/libs/cookie";
import { setToken, getToken } from "@/libs/localStorage";
import { useRouter } from "next/navigation";
import { useSetAuthContext } from "@/contexts/authContext";
import { useSnackbar } from "@/contexts/snackbarContext";

const SignIn: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const cookie = getToken();
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useSetAuthContext();
  const showSnackbar = useSnackbar();

  useEffect(() => {
    if (!cookie) setUser(undefined);
  }, [setUser, cookie, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginModel>();

  const onSubmit: SubmitHandler<LoginModel> = async (
    credentials: LoginModel
  ) => {
    setIsLoading(true);
    try {
      const res = await loginWithEmailAndPassword(credentials);
      console.log(res.data);
      const user = new User(res.data.data);
      setUser(user);
      setToken(res.data.data.token);
      setTokenCookie(res.data.data.token, AUTHORIZATION_TOKEN_EXPIRATION);
      window.location.href = "/users/";
      showSnackbar({
        newMessage: "Login is success.",
        newSeverity: "success",
      });
    } catch (error: any) {
      showSnackbar({
        newMessage: error.response.data.message,
        newSeverity: "error",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoginFormComponent
        isLoading={isLoading}
        onSubmit={onSubmit}
        errors={errors}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        handleSubmit={handleSubmit}
        register={register}
      />
    </>
  );
};

export default SignIn;
