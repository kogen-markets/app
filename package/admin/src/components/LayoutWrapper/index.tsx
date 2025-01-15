"use client";

import React, { useState, useEffect } from "react";
import { LayoutWrapperContent } from "@/components/LayoutWrapper/index.content";
import { SWRConfig } from "swr";
import { fetcher } from "@/libs/axios";

type ShowWrapperProps = {
  children: React.ReactNode;
};

export const ShowWrapper: React.FC<ShowWrapperProps> = ({
  children,
}: ShowWrapperProps) => {
  const drawerWidth = 200;

  const [initialRenderComplete, setInitialRenderComplete] =
    useState<boolean>(false);

  useEffect(() => {
    setInitialRenderComplete(true);
  }, []);

  if (!initialRenderComplete) return <></>;

  return (
    <SWRConfig
      value={{
        fetcher: fetcher,
      }}
    >
      <LayoutWrapperContent drawerWidth={drawerWidth}>
        {children}
      </LayoutWrapperContent>
    </SWRConfig>
  );
};
