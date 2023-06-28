<template>
  <div>
    <Breadcrumbs />
    <v-container>
      <h1 class="title-helios">
        {{
          getRouteMarketComputed
            ? $t('page.subscription.produits.title', { market: getRouteMarketComputed })
            : $t('page.subscription.produits.title', { market: '' })
        }}
      </h1>
      <v-container class="mt-6 pa-0">
        <template v-if="products">
          <div class="border-2 border-grey pa-5 bg-white">
            <ProductDisplayItem
              v-if="getRouteMarketComputed"
              :products="getProductMarketFilterByProductComputed"
            />
            <template v-else>
              <ProductDisplayItem
                v-for="products in productByMarket"
                :key="products.id"
                :products="products"
              />
            </template>
          </div>
        </template>
        <template v-else>
          <ProductItemSkeleton
            v-for="i in getRouteMarketComputed ? 1 : 3"
            :key="i"
            :no-row="true"
            :col-loop="8"
          />
        </template>
      </v-container>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import Breadcrumbs from '@/components/common/BreadCrumbs.vue';
import ProductDisplayItem from '@/components/product/ProductDisplayItem.vue';
import ProductItemSkeleton from '@/components//product/ProductItemSkeleton.vue';
import useAuth from '@/composables/authenticate/useAuth';
import useProducts from '@/composables/useProducts';
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const { products, productByMarket, getProducts } = useProducts();
const { isAuthenticatedComputed } = useAuth();
const route = useRoute();

onMounted(async () => {
  if (isAuthenticatedComputed.value) {
    await getProducts();
  }
});

const getRouteMarketComputed = computed(() => {
  if (route.params.market == undefined) {
    return;
  } else {
    return changeRoute(String(route.params.market));
  }
});

const getProductMarketFilterByProductComputed = computed(() => {
  if (route.query.new && route.params.market) {
    return products.value.filter((item) => {
      return item.typeRisque === route.params.market;
    });
  }
  if (route.params.product) {
    const filtredProducts = [];
    products?.value.forEach((element) => {
      if (
        String(element.marche.nom).toUpperCase() === String(route.params.market).toUpperCase() &&
        String(element.id) === String(route.params.product)
      ) {
        filtredProducts.push(element);
      }
    });
    return filtredProducts;
  } else if (route.params.market && !route.params.product) {
    return productByMarket.value[getRouteMarketComputed.value];
  } else {
    return [];
  }
});

const changeRoute = (typeRisque: string): string => {
  switch (typeRisque) {
    case 'PROFESSIONNEL_ENTREPRISE': {
      return 'Professionnel';
    }
    case 'AGRICOLE': {
      return 'Agricole';
    }
    case 'ASSOCIATION': {
      return 'Association';
    }
    case 'PARTICULIER': {
      return 'Particulier';
    }
    case 'ASL':
    case 'PROPRIETAIRE':
    case 'COPROPRIETE': {
      return 'Immobilier';
    }
    default:
      return typeRisque;
  }
};

watch(
  () => isAuthenticatedComputed.value,
  (isAuthenticated: boolean) => {
    if (isAuthenticated) {
      getProducts();
    }
  }
);
</script>
