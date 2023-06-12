export default interface IRootNavigation {
  icon: string;
  title: string;
  link: string;
  children?: IRootNavigationChildren[];
}

export interface IRootNavigationChildren {
  icon: string;
  childTitle: string;
  childLink: string;
}
