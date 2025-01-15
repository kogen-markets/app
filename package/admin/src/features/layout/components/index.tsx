"use client";

import React from "react";
import SideMenu from "@/components/Sidebar";

export type breadcrumbProps = { label: string; href: string };
export const Layout = ({
  children,
  breadcrumb,
}: Readonly<{
  children: React.ReactNode;
  breadcrumb: breadcrumbProps;
}>) => {
  return (
    <>
      <div className="flex items-start">
        <SideMenu drawerWidth={250} isDrawerOpen={true} />
        <main className="relative w-full overflow-y-auto dark:bg-gray-900 lg:ml-64 lg:mt-[70px] bg-[#eef2f6] h-[calc(100vh-68px)] ">
          <div className="m-5">
            <div className="roundes-lg p-5 text-lg text-slate-900 bg-white my-5 font-bold">
              {breadcrumb.label}
            </div>
            <div className="p-5 bg-white">{children}</div>
          </div>
        </main>
      </div>
    </>
  );
};
