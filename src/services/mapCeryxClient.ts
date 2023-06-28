import type { DevisEntreprise } from 'open-api-souscription-typescript';
import type { CeryxClientSearch, CeryxClient } from 'open-api-souscription-typescript';
import { ref } from 'vue';
import _ from 'lodash';
import useDevis from '@/composables/useDevis';
import getCountryName from '@/services/getCountryName';
import useConstante from '@/composables/useConstante';

export default function () {
  const { getCodePays } = getCountryName();
  const { devis, setDevisAction } = useDevis();
  const { REGEX } = useConstante();

  const devisUpdatedRef = ref<DevisEntreprise>(devis.value);

  const mapReturnCeryxThen = (response: CeryxClient) => {
    devisUpdatedRef.value.souscripteurPersonneMorale.adresse.pays = getCodePays(response.pays);
    devisUpdatedRef.value.numClientCeryx = response.numClient;
    devisUpdatedRef.value.souscripteurPersonneMorale.raisonSociale = response.nom;
    devisUpdatedRef.value.souscripteurPersonneMorale.identifiantLegal = response.siret;
    devisUpdatedRef.value.souscripteurPersonneMorale.adresse.adresse1 = response.adresse;
    devisUpdatedRef.value.souscripteurPersonneMorale.adresse.adresse2 = response.adresse2;
    devisUpdatedRef.value.souscripteurPersonneMorale.adresse.adresse3 = response.adresse3;
    devisUpdatedRef.value.souscripteurPersonneMorale.adresse.codePostal = response.codePostal;
    devisUpdatedRef.value.souscripteurPersonneMorale.adresse.ville = response.ville;
    devisUpdatedRef.value.souscripteurPersonneMorale.telephone1 = getFormatTel(response.telephone1);
    devisUpdatedRef.value.souscripteurPersonneMorale.telephone2 = getFormatTel(response.telephone2);
    devisUpdatedRef.value.souscripteurPersonneMorale.mail = response.email;
    devisUpdatedRef.value.representantPersonnePhysique.civilite = response.representantCivilite;
    devisUpdatedRef.value.representantPersonnePhysique.nom = response.representantNom;
    devisUpdatedRef.value.representantPersonnePhysique.prenom = response.representantPrenom;
    devisUpdatedRef.value.representantPersonnePhysique.qualiteProfessionnelle = response.qualite;
    setDevisAction(_.merge(devis.value, devisUpdatedRef.value));
  };

  const mapReturnCeryxCatch = (ClientCeryx: CeryxClientSearch) => {
    devisUpdatedRef.value.numClientCeryx = parseInt(ClientCeryx.lienClient);
    devisUpdatedRef.value.souscripteurPersonneMorale.raisonSociale = ClientCeryx.nom;
    devisUpdatedRef.value.souscripteurPersonneMorale.identifiantLegal = ClientCeryx.siret;
    devisUpdatedRef.value.souscripteurPersonneMorale.adresse.adresse1 = ClientCeryx.adresse;
    devisUpdatedRef.value.souscripteurPersonneMorale.adresse.adresse2 = ClientCeryx.adresse2;
    devisUpdatedRef.value.souscripteurPersonneMorale.adresse.adresse3 = ClientCeryx.adresse3;
    devisUpdatedRef.value.souscripteurPersonneMorale.adresse.codePostal = ClientCeryx.codePostal;
    devisUpdatedRef.value.souscripteurPersonneMorale.adresse.ville = ClientCeryx.ville;
    devisUpdatedRef.value.souscripteurPersonneMorale.adresse.pays = ClientCeryx.pays;
    devisUpdatedRef.value.souscripteurPersonneMorale.telephone1 = getFormatTel(
      ClientCeryx.telephone1
    );
    devisUpdatedRef.value.souscripteurPersonneMorale.mail = ClientCeryx.email;
    setDevisAction(_.merge(devis.value, devisUpdatedRef.value));
  };

  const getFormatTel = (numTel: string): string => {
    const newTel = numTel.replace('(', '').replace(')', '');
    return REGEX.PHONE.test(newTel) ? newTel : '';
  };

  return {
    mapReturnCeryxThen,
    mapReturnCeryxCatch
  };
}
