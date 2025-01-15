"use client";

import React from "react";
import { Box } from "@mui/material";
import { AppBar } from "@/components/AppBar";
import SideMenu from "@/components/Sidebar";
import { useState } from "react";

type LayoutWrapperContentProps = {
  children: React.ReactNode;
  drawerWidth: number;
};

export const LayoutWrapperContent: React.FC<LayoutWrapperContentProps> = ({
  children,
  drawerWidth,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <AppBar
        handleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
        drawerWidth={drawerWidth}
        isDrawerOpen={isDrawerOpen}
      />
      <SideMenu isDrawerOpen={isDrawerOpen} drawerWidth={drawerWidth} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: isDrawerOpen ? `calc(100% - ${drawerWidth}px` : "100%",
        }}
      >
        <Box
          sx={{
            my: 6,
            backgroundColor: "white",
          }}
        >
          <Box sx={{ mx: 2, my: 8, py: 2 }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
};
