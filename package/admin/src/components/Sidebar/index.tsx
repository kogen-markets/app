"use client";

import { SideContent } from "@/components/Sidebar/index.content";

type SideMenuProps = {
  drawerWidth: number;
  isDrawerOpen: boolean;
};

export default function SideMenu({
  drawerWidth,
  isDrawerOpen,
}: SideMenuProps) {
  return <SideContent drawerWidth={drawerWidth} isDrawerOpen={isDrawerOpen} />;
}
