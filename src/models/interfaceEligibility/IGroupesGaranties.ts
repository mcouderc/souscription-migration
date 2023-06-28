import type IGarantie from './IGarantie';

export default interface IGroupesGaranties {
  id: number;
  nom: string;
  code: string;
  garanties: IGarantie[];
  prestations: IGarantie[];
  services: IGarantie[];
}
