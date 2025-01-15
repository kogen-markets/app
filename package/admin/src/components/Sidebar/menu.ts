import { MenuItemType } from "@/types/model/menu";

export const createSideBar = (): Array<MenuItemType> => {
  return [
    {
      name: "Users",
      link: "/users",
      // icon: <InsertDriveFileOutlined />,
    },
    {
      name: "Trade History",
      link: "/trade-history",
      // icon: <TimelineIcon />,
      // children: [{ name: "Trade History", link: "/trade-history" }],
    },
  ];
};
