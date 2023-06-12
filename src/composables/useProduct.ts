import { computed } from 'vue';
import { useProductSelectedStore } from '@/stores/productSelectedStore';
import type { Produit } from 'open-api-souscription-typescript';

export default function () {
  const selectedProductStore = useProductSelectedStore();
  const product = computed(() => selectedProductStore.product);
  const setProduct = (product: Produit) => {
    selectedProductStore.setProduct(product);
  };

  return {
    product,
    setProduct
  };
}
