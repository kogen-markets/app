"use client";
import { AppBarContent } from "@/components/AppBar/index.content";

type AppBarProps = {
  drawerWidth: number;
  handleDrawer: () => void;
  isDrawerOpen: boolean;
};

export const AppBar: React.FC<AppBarProps> = ({
  drawerWidth,
  handleDrawer,
  isDrawerOpen,
}) => (
  <AppBarContent
    drawerWidth={drawerWidth}
    isDrawerOpen={isDrawerOpen}
    handleDrawer={() => handleDrawer()}
  />
);
