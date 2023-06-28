import { ref } from 'vue';

export default function () {
  const listFranceChildren = ref<string[]>([]);
  /**
   * récupère les pays à afficher dans SelectCountry Renvoie la liste des codes des pays dont le parent est la France et renvoie la France elle-même
   * @param itemsCountryRef
   */
  const checkIfCountryIsFranceChildren = (itemsCountryRef) => {
    // On prend la liste des pays possibles à sélectioner, et pour chacun d'entre eux on vérifie
    // s'ils sont la France ou un pays dont le parent est la France (départements d'outre mer)
    // On renvoie ainsi la liste des pays liés à la France
    // On pourra ensuite s'assurer si le pays sélectionné fait partie de cette liste, et si oui on
    // Affichera l'auto complétion de l'adresse via le v-if
    itemsCountryRef.value.forEach((element) => {
      if (element?.code === 'FR' || element?.parent?.code === 'FR') {
        listFranceChildren.value.push(element.code);
      }
    });
    return listFranceChildren;
  };

  return { checkIfCountryIsFranceChildren };
}
