export interface NavLink {
  path: string;
  text: string;
  icon: JSX.Element;
  enabled: boolean;
  alert?: 'advisor' | 'broker';
}

export interface Section {
  name: string;
  links: NavLink[];
  enabled: boolean;
  nav: "top" | "side";
}

export interface FrenBreadcrumbsProps {
  navStack: NavLink[];
  navigate: (link: string) => void;
}
