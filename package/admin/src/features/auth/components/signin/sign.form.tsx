"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Link as MuiLink,
  Stack,
  TextField,
  CircularProgress,
} from "@mui/material";
import {
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";

import { LoginModel } from "@/features/auth/types";
import Logo from "../../../../../public/kogen-logo-white.png";
import { EmailOutlined, Lock } from "@mui/icons-material";

type LoginFormComponentProps = {
  onSubmit: SubmitHandler<LoginModel>;
  errors: FieldErrors<LoginModel>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: UseFormHandleSubmit<LoginModel, undefined>;
  register: UseFormRegister<LoginModel>;
  isLoading: boolean;
};

export const LoginFormComponent: React.FC<LoginFormComponentProps> = ({
  onSubmit,
  errors,
  showPassword,
  setShowPassword,
  handleSubmit,
  register,
  isLoading,
}) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          mx: 2,
        }}
      >
        <Image src={Logo} alt="Logo" className="h-[50px] lg:h-[87px] w-auto" />
        <div>
          <Link href="" legacyBehavior passHref>
            <MuiLink color="inherit"> </MuiLink>
          </Link>
        </div>
      </Box>
      <Container maxWidth="sm" sx={{ my: 6 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} maxWidth="sm" sx={{ my: 6 }}>
            <TextField
              label={"Email"}
              placeholder={"Email"}
              variant="standard"
              type="email"
              margin="normal"
              fullWidth
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "invalid email address",
                },
              })}
              error={"email" in errors}
              helperText={errors?.email?.message}
              sx={{ my: -1 }}
              InputProps={{
                endAdornment: <EmailOutlined sx={{ mx: 1 }} />,
              }}
            />
            <TextField
              label={"Password"}
              placeholder={"Password"}
              variant="standard"
              type={showPassword ? "text" : "password"}
              margin="normal"
              fullWidth
              error={"password" in errors}
              helperText={errors?.password?.message}
              {...register("password", {
                required: "Require password",
              })}
              sx={{ my: -1 }}
              InputProps={{
                endAdornment: <Lock sx={{ mx: 1 }} />,
              }}
            />
            <FormControlLabel
              label={"password show"}
              control={
                <Checkbox onClick={() => setShowPassword(!showPassword)} />
              }
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                borderRadius: 0,
                boxShadow: 0,
              }}
              size="large"
            >
              {isLoading && (
                <CircularProgress size={20} sx={{ color: "#fff", mr: 2 }} />
              )}
              <span style={{ fontWeight: "bold" }}>Login</span>
            </Button>
          </Stack>
        </form>
      </Container>
    </>
  );
};
