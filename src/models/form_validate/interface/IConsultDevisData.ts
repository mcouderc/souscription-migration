import type { IConsultDevisDataChild } from './IConsultDevisDataChild';

export interface IConsultDevisData {
  id: string;
  title: string;
  sectionData: IConsultDevisDataChild[];
}
