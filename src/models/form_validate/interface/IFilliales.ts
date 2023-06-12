import type { Adresse } from 'open-api-souscription-typescript';

export interface IFilliales {
  codeNaf?: string;
  formeJuridique?: string;
  raisonSociale?: string;
  identifiantLegal?: string;
  activite?: string;
  dateCreation?: string;
  adresse?: Adresse;
  telephone1?: string;
  telephone2?: string;
  mail?: string;
}
