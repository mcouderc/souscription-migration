import type { Clause } from 'open-api-souscription-typescript';

export default interface IGarantie {
  id: number;
  nom: string;
  plafondFranchiseSeuil: string;
  exemple: string;
  clauses: Clause[];
  ordre: number;
  estApplicable?: boolean;
  type: string;
}
