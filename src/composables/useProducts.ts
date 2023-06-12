import { computed } from 'vue';
import { useProduitStore } from '@/stores/produitStore';

export default function () {
  const productsStore = useProduitStore();
  const products = computed(() => productsStore.products);
  const productByMarket = computed(() => productsStore.productByMarket);
  const markets = computed(() => productsStore.markets);

  const getProducts = (): Promise<void> => {
    return productsStore.getProducts();
  };

  const getMarketNameByProductId = (productId: number): string => {
    return productsStore.getMarketNameByProductId(productId);
  };

  return {
    products,
    productByMarket,
    markets,
    getProducts,
    getMarketNameByProductId
  };
}
