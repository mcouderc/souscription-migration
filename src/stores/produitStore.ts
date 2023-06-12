import type { Produit } from 'open-api-souscription-typescript';
import { produitsApi } from '@/plugins/open-api';
import type { IMarche } from '@/models/IMarche';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

interface IProduitState {
  products: Produit[];
  productByMarket: Produit[];
  markets: IMarche[];
}

export const useProduitStore = defineStore('produitStore', () => {
  const state = ref({
    products: null,
    productByMarket: null,
    markets: null
  } as unknown as IProduitState);

  const products = computed<Produit[]>(() => {
    return state.value.products;
  });
  const productByMarket = computed<Produit[]>(() => {
    return state.value.productByMarket;
  });
  const markets = computed<IMarche[]>(() => {
    return state.value.markets;
  });

  async function getProducts(): Promise<void> {
    const response = await produitsApi().listProduits();
    state.value.products = response.data;

    getMarkets(response.data);
    groupByMarketName(response.data);
  }

  function getMarkets(payload: Produit[]) {
    // TODO: replace for get markets list
    const markets = payload?.reduce((acc, item) => {
      const key: string = item['marche']['nom'];
      if (!acc[key] && key) {
        acc[key] = [];
        acc[key].push({
          id: item['marche']['id'] ?? '',
          name: item['marche']['nom'] ?? '',
          color: item['couleur'] ?? '',
          text: item['marche']['accrocheCourte']
        });
      }
      return acc;
    }, {} as IMarche[]);

    state.value.markets = markets;
  }

  function groupByMarketName(payload: Produit[]) {
    const offersComparative = [
      {
        nom: 'COMPARATIF DES OFFRES',
        couleur: 'orange',
        marche: { nom: 'Professionnel' },
        isOffersComparative: true
      }
    ];
    const groupByMarketName = {};
    for (const key in payload) {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        const element = payload[key];
        if (element.marche.nom) {
          if (!groupByMarketName[element.marche.nom]) {
            groupByMarketName[element.marche.nom] = [];
          }
          groupByMarketName[element.marche.nom].push(element);
        }
      }
    }
    const offersWithProdcuts = offersComparative.concat(groupByMarketName['Professionnel']);
    groupByMarketName['Professionnel'] = offersWithProdcuts;

    state.value.productByMarket = groupByMarketName as Produit[];
  }

  const getMarketNameByProductId = (productId: number): string => {
    let marcheName = '';
    for (let i = 0; i < products.value.length; i++) {
      if (products.value[i].id === productId) {
        marcheName = products.value[i].marche.nom;
        break;
      }
    }
    return marcheName;
  };

  return {
    products,
    productByMarket,
    markets,
    getProducts,
    getMarketNameByProductId
  };
});
