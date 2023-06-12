<template>
  <v-container class="border-2 border-grey bg-white px-5">
    <v-card theme="light" class="ma-0 pa-0" elevation="0">
      <v-card-title class="px-0">
        <v-icon left color="primary"> mdi-file-document-outline </v-icon>
        <span class="subtitle-1 font-weight-bold uppercase primary&#45;&#45;text">
          {{ $t('page.subscription.notifications.devis.title') }}
        </span>
      </v-card-title>

      <v-card-text class="px-0 pb-0 pt-2 text-sm-body-2">
        {{ $t('page.subscription.notifications.devis.devisExpire') }}
        <a
          @click="onButtonClick()"
          class="font-semibold capitalize px-0"
          color="primary"
          text
          plain
        >
          {{ notifications.devisExpirant }}
        </a>
      </v-card-text>

      <v-card-text class="px-0 pb-0 pt-2 text-sm-body-2">
        {{ $t('page.subscription.notifications.devis.devisEnCours') }}
        <a
          @click="onButtonClick()"
          class="font-semibold capitalize px-0"
          color="primary"
          text
          plain
        >
          {{ notifications.devisEnCours }}
        </a>
      </v-card-text>

      <v-card-text class="px-0 pb-0 pt-2 text-sm-body-2">
        {{
          $t('page.subscription.notifications.devis.ContratRealise', {
            anneeEnCours: new Date().getFullYear(),
            contratRealisesAnneeEnCours: notifications.contratRealisesAnneeEnCours
          })
        }}
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import useUser from '@/composables/authenticate/useUser';
import router from '@/router';
import {
  DevisEntrepriseStatutEnum,
  type UserInformationUserIndicateurs
} from 'open-api-souscription-typescript';
import { onMounted, ref } from 'vue';

const { apiCallGetUserInfoIndicateur } = useUser();

const notifications = ref<UserInformationUserIndicateurs>({
  devisEnCours: 0,
  devisExpirant: 0,
  contratRealisesAnneeEnCours: 0
});

const setNotifications = async (): Promise<UserInformationUserIndicateurs> => {
  const userInfoIndicateurResponse = await apiCallGetUserInfoIndicateur();
  if (userInfoIndicateurResponse) {
    notifications.value = { ...userInfoIndicateurResponse };
  }
  return userInfoIndicateurResponse;
};

const onButtonClick = () => {
  router.push('/devis-etablis?statut=' + DevisEntrepriseStatutEnum.Emis);
};

onMounted(async () => {
  await setNotifications();
});
</script>
