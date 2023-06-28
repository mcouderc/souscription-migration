import type { Pays } from 'open-api-souscription-typescript/dist/fr/cfdp/axios/generated/souscription/model/pays';

export default interface IPaysForSelect extends Pays {
  isDoubleParent?: boolean;
}
