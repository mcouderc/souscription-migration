import type { IChampValidate } from '@/models/form_validate/interface/IChampValidate';

export interface IAntecedant {
  display: boolean;
  nombreProcedures?: IChampValidate;
  nombreProceduresEnDefense?: IChampValidate;
  nombreProceduresEnDemande?: IChampValidate;
  assuranceDejaSouscrite?: IChampValidate;
  resiliationAssureur?: IChampValidate;
  redressementJudiciaire?: IChampValidate;
}
