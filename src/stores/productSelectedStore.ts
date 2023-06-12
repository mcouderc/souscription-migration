import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

import type { Produit } from 'open-api-souscription-typescript';

interface IProductSelectedState {
  product: Produit;
}

export const useProductSelectedStore = defineStore('productSelectedStore', () => {
  const state = ref({ product: {} } as IProductSelectedState);

  const product = computed(() => {
    return state.value.product;
  });

  function setProduct(product: Produit): void {
    state.value.product = product;
  }

  return {
    product,
    setProduct
  };
});
