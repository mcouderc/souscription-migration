import { computed } from 'vue';
import { useProductSelectedStore } from './authenticate/productSelectedStore';
import type { Produit } from 'open-api-souscription-typescript';

export default function () {
  const selectedProductStore = useProductSelectedStore();
  const product = computed(() => selectedProductStore.product);
  const setProductAction = (product: Produit) => {
    selectedProductStore.setProduct(product);
  };

  return {
    product,
    setProductAction
  };
}
