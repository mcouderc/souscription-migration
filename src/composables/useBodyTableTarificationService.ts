import type IFormulaValorisee from '@/models/interfaceEligibility/IFormulaValorisee';
import { ref } from 'vue';
import type IGroupeGaranties from '../models/interfaceEligibility/IGroupesGaranties';
import type IGarantie from '@/models/interfaceEligibility/IGarantie';
import type { IGarantieContenueOuIntituleGarantieHeader } from '@/models/interfaceEligibility/IGarantieContenueOuIntituleGarantieHeader';

export default function useBodyTableTarificationService() {
  const gpmtsGarantieFormuleRef = ref<IGroupeGaranties[]>([]);
  const optionsGpesGarantieListRef = ref<IFormulaValorisee[]>([]);
  const gpmtGarantieOptionsRef = ref<IGroupeGaranties[]>([]);

  const mapGpeGarantiesGaranties = new Map();
  const headersGarantiesFinal = ref<IGarantieContenueOuIntituleGarantieHeader[]>([]);

  const checkType = {
    isDivider: (divider: string): boolean => {
      return divider === 'divider';
    },

    isPrice: (price: string): boolean => {
      return price === 'price';
    },

    isName: (name: string): boolean => {
      return name === 'name';
    },

    isValue: (jsonValeur: IGarantieContenueOuIntituleGarantieHeader): boolean => {
      if (jsonValeur === null || jsonValeur === undefined) {
        return false;
      } else {
        return true;
      }
    }
  };

  const getGroupementGarantieByType = {
    getListGroupementsGarantiesDepuisUneFormule: (
      produitCalculResult: IFormulaValorisee[]
    ): void => {
      const formule = produitCalculResult.find(
        (el: IFormulaValorisee) => el.formule.type === 'FORMULE'
      );
      gpmtsGarantieFormuleRef.value = formule.formule.groupesGarantiesServices;
      getGroupementGarantieByType.getListGroupementsGarantiesOption(produitCalculResult);
    },

    getListGroupementsGarantiesOption: (produitCalculResult: IFormulaValorisee[]): void => {
      optionsGpesGarantieListRef.value = produitCalculResult.filter(
        (el: IFormulaValorisee) => el.formule.type === 'OPTION'
      );
      if (optionsGpesGarantieListRef.value.length) {
        optionsGpesGarantieListRef.value.forEach((opt: IFormulaValorisee) => {
          opt.formule.groupesGarantiesServices.forEach((gpmtGarantie: IGroupeGaranties) => {
            gpmtGarantieOptionsRef.value.push(gpmtGarantie);
          });
        });
      }
      constructionMap.creationObjetMapGpeGarantie();
    }
  };

  const constructionMap = {
    creationTableauGaranties: ({ array, group }) => {
      constructionMap.sortGarantieOption(array);
      return array.map((garantie: IGarantie) => {
        return {
          text: garantie.nom,
          value: `${garantie.type}-${garantie.id}`,
          group,
          order: garantie.ordre
        };
      });
    },

    creationObjetMapGpeGarantie: (): void => {
      //je vais dans chaque formule valo
      //dans la fomrule unique récupérée je boucle pour récup les gpmtgaranties
      gpmtsGarantieFormuleRef.value?.forEach((garantiePrestaService: IGroupeGaranties) => {
        const group = garantiePrestaService.code;

        const result = [
          //puis on va boucler sur garanties
          ...constructionMap.creationTableauGaranties({
            array: garantiePrestaService.garanties,
            group
          }),
          ...constructionMap.creationTableauGaranties({
            array: garantiePrestaService.prestations,
            group
          }),
          ...constructionMap.creationTableauGaranties({
            array: garantiePrestaService.services,
            group
          })
        ];

        mapGpeGarantiesGaranties.set(garantiePrestaService.nom, result);
      });
      if (optionsGpesGarantieListRef.value.length) {
        constructionMap.ajouterALaMapLesOptions();
      } else {
        createHeadersFinalFromMap();
      }
    },

    creationObjetGarantieInit: (
      garantie: IGarantie,
      group,
      ordre
    ): IGarantieContenueOuIntituleGarantieHeader => {
      return {
        text: garantie.nom,
        value: `${garantie.type}-${garantie.id}`,
        group: group,
        ordre: ordre
      };
    },

    sortGarantieOption: (array: IGarantie[]): IGarantie[] => {
      return array.sort((garantieA, garantieB) => garantieA.ordre - garantieB.ordre);
    },

    ajouterALaMapLesOptions: (): void => {
      //ensuite on ajoute les options dans la map
      optionsGpesGarantieListRef.value.forEach((option: IFormulaValorisee) => {
        //pour chaque option
        option.formule.groupesGarantiesServices.forEach((gpeGarantieOption: IGroupeGaranties) => {
          const group = gpeGarantieOption.code;
          //on vérifie si la clé (le nom du gpe garantie) existe
          if (mapGpeGarantiesGaranties.get(gpeGarantieOption.nom)) {
            //si la clé existe il faut s'assurer que la garantie n'existe pas non plus
            constructionMap.sortGarantieOption(gpeGarantieOption.garanties);
            gpeGarantieOption.garanties.forEach((garantie: IGarantie) => {
              //ici on utilise un objet intermédiaire sinon les options vont etre un tableau dans un tableau et on ne pourra pas afficher
              const result = constructionMap.creationObjetGarantieInit(
                garantie,
                gpeGarantieOption.code,
                garantie.ordre
              );

              //On push au tableau de la key correspondante la garantie contenue dans l'option
              mapGpeGarantiesGaranties.get(gpeGarantieOption.nom).push(result);
            });

            constructionMap.sortGarantieOption(gpeGarantieOption.prestations);
            gpeGarantieOption.prestations.forEach((prestation: IGarantie) => {
              const result = constructionMap.creationObjetGarantieInit(
                prestation,
                gpeGarantieOption.code,
                prestation.ordre
              );

              //On push au tableau de la key correspondante la garantie contenue dans l'option
              mapGpeGarantiesGaranties.get(gpeGarantieOption.nom).push(result);
            });

            constructionMap.sortGarantieOption(gpeGarantieOption.services);
            gpeGarantieOption.services.forEach((service: IGarantie) => {
              const result = constructionMap.creationObjetGarantieInit(
                service,
                gpeGarantieOption.code,
                service.ordre
              );

              //On push au tableau de la key correspondante la garantie contenue dans l'option
              mapGpeGarantiesGaranties.get(gpeGarantieOption.nom).push(result);
            });

            //puis on retire les doublons s'il y en a via un filter réalisé sur le tableau correspondant à la key (dans la map)
            const tableauToFilter = mapGpeGarantiesGaranties.get(gpeGarantieOption.nom);

            const tableauFiltered = tableauToFilter.filter(
              (
                garantieCourante: IGarantieContenueOuIntituleGarantieHeader,
                indexElementCourant: number,
                a: IGarantieContenueOuIntituleGarantieHeader[]
              ) =>
                a.findIndex((garantie) => garantie.value === garantieCourante.value) ===
                indexElementCourant
            );

            //pour éviter des erreurs, on supprime donc la key sur laquelle on travaille
            mapGpeGarantiesGaranties.delete(mapGpeGarantiesGaranties.get(gpeGarantieOption.nom));

            //puis on set avec le novueau tableau
            mapGpeGarantiesGaranties.set(gpeGarantieOption.nom, tableauFiltered);
          }

          //si il n'existe pas on crée une nouvelle clé et on ajoute les garanties/prestation/service en valeur
          else {
            const result = [
              ...constructionMap.creationTableauGaranties({
                array: gpeGarantieOption.garanties,
                group
              }),
              ...constructionMap.creationTableauGaranties({
                array: gpeGarantieOption.prestations,
                group
              }),
              ...constructionMap.creationTableauGaranties({
                array: gpeGarantieOption.services,
                group
              })
            ];

            mapGpeGarantiesGaranties.set(gpeGarantieOption.nom, result);
          }
        });
      });
      createHeadersFinalFromMap();
    }
  };

  //Construction des headers que l'on va utiliser dans le composant final
  const createHeadersFinalFromMap = (): void => {
    headersGarantiesFinal.value = [];
    //Ligne pour pouvoir avoir les nom des formules en haut de la page
    //première ligne (pour pouvoir avoir les intitulés des formules)
    headersGarantiesFinal.value.push({
      text: '',
      align: 'start',
      sortable: false,
      value: 'name'
    });
    headersGarantiesFinal.value.push({
      text: '',
      align: 'start',
      sortable: false,
      value: 'price'
    });
    mapGpeGarantiesGaranties.forEach((value, key) => {
      headersGarantiesFinal.value.push({
        text: key,
        value: 'divider',
        group: key
      });

      value.forEach((element: IGarantieContenueOuIntituleGarantieHeader) => {
        headersGarantiesFinal.value.push({
          text: element.text,
          value: element.value,
          group: element.group
        });
      });
    });
  };

  return {
    getListGroupementsGarantiesDepuisUneFormule:
      getGroupementGarantieByType.getListGroupementsGarantiesDepuisUneFormule,
    headersGarantiesFinal,
    isName: checkType.isName,
    isDivider: checkType.isDivider,
    isPrice: checkType.isPrice,
    isValue: checkType.isValue
  };
}
