export interface IConsultDevisDataChild {
  label: string;
  value:
    | string
    | number
    | {
        adresse1?: string;
        adresse2?: string;
        adresse3?: string;
        codePostal?: string;
        ville?: string;
        pays?: string;
      };
}
