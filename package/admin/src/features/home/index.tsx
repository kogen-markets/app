"use client";

import React from "react";
import { useAuthContext } from "@/contexts/authContext";
import { Layout } from "@/features/layout/components";

export const Home = () => {
  const { user } = useAuthContext();

  return <div>Home page</div>;
};
