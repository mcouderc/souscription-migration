import type { Pays } from 'open-api-souscription-typescript/dist/fr/cfdp/axios/generated/souscription/model/pays';
import { useI18n } from 'vue-i18n';
import type VueI18n from 'vue-i18n';
import useConstante from '@/composables/useConstante';

export default function validationRulesSiret() {
  const { REGEX } = useConstante();
  const { t } = useI18n();

  const siretIsValid = (siret: string, country: string): boolean => {
    if (!siret) {
      return false;
    }
    siret = siret.replace(new RegExp('[^(a-zA-Z0-9)]', 'g'), ''); //On nettoie la chaîne de caractère.
    let isValid = false; //condition de sortie

    switch (country) {
      case 'GP':
      case 'GF':
      case 'RE':
      case 'MQ':
      case 'YT':
      case 'NC':
      case 'PF':
      case 'BL':
      case 'MF':
      case 'PM':
      case 'WF':
      case 'FR': //France
        if (siret.length != 14 || isNaN(parseInt(siret))) {
          isValid = false;
        } else {
          // Donc le SIRET est un numérique à 14 chiffres
          // Les 9 premiers chiffres sont ceux du SIREN (ou RCS), les 4 suivants
          // correspondent au numéro d'établissement
          // et enfin le dernier chiffre est une clef de LUHN.
          let somme = 0;
          let tmp: number;
          for (let cpt = 0; cpt < siret.length; cpt++) {
            if (cpt % 2 == 0) {
              // Les positions impaires : 1er, 3è, 5è, etc...
              tmp = parseInt(siret.charAt(cpt)) * 2; // On le multiplie par 2
              if (tmp > 9) tmp -= 9; // Si le résultat est supérieur à 9, on lui soustrait 9
            } else tmp = parseInt(siret.charAt(cpt));
            somme += tmp;
          }
          if (somme % 10 == 0) isValid = true;
          // Si la somme est un multiple de 10 alors le SIRET est valide
          else isValid = false;
        }
        break;

      case 'BE': {
        // 10 caractères numériques. Il commence par 0 ou 1, se poursuit sur 9 chiffres. Il peut y avoir des séparateurs "." ex : 0628887443
        const belgiqueRegex = new RegExp(REGEX.COUNTRYS.BE);
        isValid = belgiqueRegex.test(siret);
        break;
      }

      case 'MC': {
        //Monaco 8 caractères avec une lettre (P ou S) en 3 ème position, le reste en integer. ex : 10S05365
        const monacoRegex = new RegExp(REGEX.COUNTRYS.MC);
        isValid = monacoRegex.test(siret);
        break;
      }

      case 'AD': {
        //Andorre 8 caractères avec la première et la dernière en lettre majuscule et au milieu des integer. ex : F123456A
        const andorreRegex = new RegExp(REGEX.COUNTRYS.AD);
        isValid = andorreRegex.test(siret);
        break;
      }

      case 'LX': {
        //Luxembourg 7 caractères avec le premier en "B" et le reste en integer B746373
        const luxembourgRegex = new RegExp(REGEX.COUNTRYS.LX);
        isValid = luxembourgRegex.test(siret);
        break;
      }
    }
    return isValid;
  };

  const keyPressCondition = (event: KeyboardEvent) => {
    if (!/[a-zA-Z0-9]/.test(event.key)) {
      event.preventDefault();
    }
  };

  const pastCondition = (siret: string | number, event: ClipboardEvent): string => {
    //S'il y a un copier coller on retire les '.' et les espace    12.3 45  352  /?./2D2'-"èè'"'9d5 35
    siret = event.clipboardData
      .getData('text')
      .toString()
      .replace(/[^0-9a-zA-Z]?/g, ''); //On remplace tout ce qui n'est pas 0-9a-zA-Z
    event.preventDefault(); //Evite les doublons sur l'event du paste
    return siret as string;
  };

  const labelComputed = (codePays: string): VueI18n.TranslateResult => {
    switch (codePays) {
      case 'GP':
      case 'YT':
      case 'MQ':
      case 'GF':
      case 'RE':
      case 'NC':
      case 'PF':
      case 'BL':
      case 'MF':
      case 'PM':
      case 'WF':
      case 'FR':
        return t('page.subscription.siret.form.siretLabel', { code: 'SIRET' });
      case 'BE':
        return t('page.subscription.siret.form.siretLabel', { code: 'BCE' });
      case 'MC':
        return t('page.subscription.siret.form.siretLabel', { code: 'RCI' });
      case 'AD':
        return t('page.subscription.siret.form.siretLabel', { code: 'NRT' });
      case 'LX':
        return t('page.subscription.siret.form.siretLabel', { code: 'RCS' });
      default:
        return t('page.subscription.siret.form.siretLabel', {
          code: "numéro d'identification"
        });
    }
  };

  const getCountryParent = (listCountry: Pays[], country: string): string => {
    return listCountry.find((item) => item.code === country).parent?.code ?? country;
  };

  return {
    siretIsValid,
    keyPressCondition,
    pastCondition,
    labelComputed,
    getCountryParent
  };
}
