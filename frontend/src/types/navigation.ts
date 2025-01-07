export interface IRoute {
  name: string;
  layout: string;
  path: string;
  icon?: JSX.Element;
  children?: IRoute[];
} 