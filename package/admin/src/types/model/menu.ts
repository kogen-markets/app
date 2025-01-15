export interface MenuItemType  {
  name: string;
  link?: string|undefined;
  children?:
    | Array<{
        name: string;
        link: string;
      }>
    | [] | undefined; 
}