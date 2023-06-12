import {
  DevisApi,
  ProduitCalculResultApi,
  SignatureElectroniqueApi,
  ProduitApi,
  DocumentApi,
  PatchDevisApi,
  ContratInformationComplementaireOutApi,
  InformationPaiementApi,
  ReponseEligibiliteApi,
  CritereApi,
  FormeJuridiqueApi,
  CodeNafApi,
  SecteurActiviteApi,
  DevisInitiatorApi,
  ActivitePrincipaleApi,
  DevisHydratorFromValorisationCritereApi,
  DevisHydratorFromFormuleSouscriteApi,
  UserInformationApi,
  CeryxClientSearchApi,
  FormulesDetailsApi,
  ExportApi,
  CeryxClientApi,
  VerificationDateEffetApi
} from 'open-api-souscription-typescript';
import type { AxiosError } from 'axios';
import axiosInstance from '@/axiosHelper';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { NotificationType } from '@/enums/notification';
import type Notification from '@/models/notification';
import { ConnexionApi } from 'open-api-espace-partenaire-souscription-typescript';

const SOUSCRIPTION_BASE_PATH = import.meta.env.VITE_SOUSCRIPTION_BASE_PATH;
const ESPACE_PARTENAIRE_BASE_PATH = import.meta.env.VITE_ESPACE_PARTENAIRE_BASE_PATH;

export const ceryxClientSearchApi: () => CeryxClientSearchApi = () => {
  return responseProxy(
    new CeryxClientSearchApi(undefined, SOUSCRIPTION_BASE_PATH, axiosInstance() as any)
  );
};

export const formulesDetailsApi: () => FormulesDetailsApi = () => {
  return responseProxy(
    new FormulesDetailsApi(undefined, SOUSCRIPTION_BASE_PATH, axiosInstance() as any)
  );
};

export const ceryxClientApi: () => CeryxClientApi = () => {
  return responseProxy(
    new CeryxClientApi(undefined, SOUSCRIPTION_BASE_PATH, axiosInstance() as any)
  );
};

export const devisApi: () => DevisApi = () => {
  return responseProxy(new DevisApi(undefined, SOUSCRIPTION_BASE_PATH, axiosInstance() as any));
};

export const devisHydratorFromValorisationCritereApi: () => DevisHydratorFromValorisationCritereApi =
  () => {
    return responseProxy(
      new DevisHydratorFromValorisationCritereApi(
        undefined,
        SOUSCRIPTION_BASE_PATH,
        axiosInstance() as any
      )
    );
  };

export const devisHydratorFromFormuleSouscriteApi: () => DevisHydratorFromFormuleSouscriteApi =
  () => {
    return responseProxy(
      new DevisHydratorFromFormuleSouscriteApi(
        undefined,
        SOUSCRIPTION_BASE_PATH,
        axiosInstance() as any
      )
    );
  };

export const activitePrincipaleApi: () => ActivitePrincipaleApi = () => {
  return responseProxy(
    new ActivitePrincipaleApi(undefined, SOUSCRIPTION_BASE_PATH, axiosInstance() as any)
  );
};

export const devisInitiatorApi: () => DevisInitiatorApi = () => {
  return responseProxy(
    new DevisInitiatorApi(undefined, SOUSCRIPTION_BASE_PATH, axiosInstance() as any)
  );
};

export const patchDevisApi: () => PatchDevisApi = () => {
  return responseProxy(
    new PatchDevisApi(undefined, SOUSCRIPTION_BASE_PATH, axiosInstance() as any)
  );
};

export const produitCalculResultApi: () => ProduitCalculResultApi = () => {
  return responseProxy(
    new ProduitCalculResultApi(undefined, SOUSCRIPTION_BASE_PATH, axiosInstance() as any)
  );
};

export const contratInformationComplementaireOutApi: () => ContratInformationComplementaireOutApi =
  () => {
    return responseProxy(
      new ContratInformationComplementaireOutApi(
        undefined,
        SOUSCRIPTION_BASE_PATH,
        axiosInstance() as any
      )
    );
  };

export const informationPaiementApi: () => InformationPaiementApi = () => {
  return responseProxy(
    new InformationPaiementApi(undefined, SOUSCRIPTION_BASE_PATH, axiosInstance() as any)
  );
};

export const produitsApi: () => ProduitApi = () => {
  return responseProxy(new ProduitApi(undefined, SOUSCRIPTION_BASE_PATH, axiosInstance() as any));
};

export const signatureElectroniqueApi: () => SignatureElectroniqueApi = () => {
  return responseProxy(
    new SignatureElectroniqueApi(undefined, SOUSCRIPTION_BASE_PATH, axiosInstance() as any)
  );
};
export const critereApi: () => CritereApi = () => {
  return responseProxy(new CritereApi(undefined, SOUSCRIPTION_BASE_PATH, axiosInstance() as any));
};
export const formeJuridiqueApi: () => FormeJuridiqueApi = () => {
  return responseProxy(
    new FormeJuridiqueApi(undefined, SOUSCRIPTION_BASE_PATH, axiosInstance() as any)
  );
};
export const codeNafApi: () => CodeNafApi = () => {
  return responseProxy(new CodeNafApi(undefined, SOUSCRIPTION_BASE_PATH, axiosInstance() as any));
};
export const secteurActiviteApi: () => SecteurActiviteApi = () => {
  return responseProxy(
    new SecteurActiviteApi(undefined, SOUSCRIPTION_BASE_PATH, axiosInstance() as any)
  );
};
export const documentsApi: () => DocumentApi = () => {
  return responseProxy(new DocumentApi(undefined, SOUSCRIPTION_BASE_PATH, axiosInstance() as any));
};
export const getEligibiliteEntrepriseResponseApi: () => ReponseEligibiliteApi = () => {
  return responseProxy(
    new ReponseEligibiliteApi(undefined, SOUSCRIPTION_BASE_PATH, axiosInstance() as any)
  );
};

//TODO vérifier cet import avec la mise à jour
// export const critereApi: () => CritererApi = () => {
//     return responseProxy(
//       new CritereApi(undefined, SOUSCRIPTION_BASE_PATH, axiosInstance() as any)
//     )
// }

// export const contratApi: () => ContratApi = () => {
//     return responseProxy(new ContratApi(undefined, SOUSCRIPTION_BASE_PATH, axiosInstance() as any))
// }

export const getConnexionApi: () => ConnexionApi = () => {
  return responseProxy(
    new ConnexionApi(undefined, ESPACE_PARTENAIRE_BASE_PATH, axiosInstance() as any)
  );
};

export const getUserInformationApi: () => UserInformationApi = () => {
  return responseProxy(
    new UserInformationApi(undefined, SOUSCRIPTION_BASE_PATH, axiosInstance() as any)
  );
};

export const getExportApi: () => ExportApi = () => {
  return responseProxy(new ExportApi(undefined, SOUSCRIPTION_BASE_PATH, axiosInstance() as any));
};
export const verificationDateEffetApi: () => VerificationDateEffetApi = () => {
  return responseProxy(
    new VerificationDateEffetApi(undefined, SOUSCRIPTION_BASE_PATH, axiosInstance() as any)
  );
};

const responseProxy = (param: any) => {
  return new Proxy(param, {
    get: function (obj, prop) {
      if (typeof obj[prop] === 'function') {
        const wrap = async (...args: any[]) => {
          try {
            return await obj[prop](...args);
          } catch (e) {
            const error = e as AxiosError;
            let errorDetail = '';
            if (error.response) {
              errorDetail = JSON.stringify(error.response.data);
            } else {
              errorDetail = JSON.stringify(error);
            }
            useNotificationStore().pushNotification({
              message: errorDetail,
              color: NotificationType.Error
            } as Notification);
            throw error;
          }
        };
        return wrap;
      }
      return obj[prop];
    }
  });
};
