import type IGroupesGaranties from './IGroupesGaranties';

export default interface IFormula {
  id: number;
  code: string;
  nom: string;
  type: string;
  formulesApplication?: string[];
  formuleAssemblage?: string;
  groupesGarantiesServices: IGroupesGaranties[];
  primeTtc: number;
}
