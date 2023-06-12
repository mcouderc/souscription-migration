<template>
  <v-container>
    <v-row align="start">
      <v-col cols="9">
        <v-row no-gutters>
          <v-container class="border-2 border-grey bg-white px-5">
            <h1 class="title-helios py-3">
              {{ $t('page.subscription.index.prospect.title') }}
            </h1>
            <v-row v-if="markets" class="mt-2">
              <!-- TODO: need back get markets list -->
              <ProductItemMarket
                v-for="data in markets"
                :key="data[0].id"
                :name="data[0].name"
                :text="data[0].text"
                :color="data[0].color"
              />
              <v-col xs="12" md="6" lg="4" class="pt-0 px-2">
                <v-card
                  theme="light"
                  tile
                  outlined
                  to="/produits"
                  class="border-2 h-100 d-flex align-center justify-center flex-column text-center"
                >
                  {{ $t('page.subscription.index.prospect.showAlls') }}
                </v-card>
              </v-col>
            </v-row>
            <template v-else>
              <ProductItemSkeleton />
            </template>
          </v-container>
        </v-row>
      </v-col>
      <v-col cols="3">
        <CardNotificationDevis />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import useProducts from '../../../../composables/useProducts';
import { onMounted, watch } from 'vue';
import ProductItemSkeleton from '@/components/product/ProductItemSkeleton.vue';
import ProductItemMarket from '@/components/product/ProductItemMarket.vue';
import CardNotificationDevis from '@/components/devis/cardsNotifications/CardNotificationDevis.vue';
import useAuth from '../../../../composables/authenticate/useAuth';
const { markets, getProducts } = useProducts();
const { isAuthenticatedComputed } = useAuth();

watch(
  () => isAuthenticatedComputed.value,
  (isAuthenticated: boolean) => {
    if (isAuthenticated) {
      getProducts();
    }
  }
);

onMounted(async () => {
  if (isAuthenticatedComputed.value) {
    await getProducts();
  }
});
</script>
