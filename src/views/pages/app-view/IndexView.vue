<template>
  <v-app theme="light" class="bg-only-default">
    <template v-if="isFirstAuthenticatedLocalRef">
      <Navigation v-if="isFirstAuthenticatedLocalRef && isBroker" />
      <v-main>
        <v-container
          fluid
          :class="['border-l border-grey', 'bg-only-default h-100']"
          style="padding-left: 10%"
        >
          <router-view :key="$route.path" />
        </v-container>
      </v-main>
    </template>

    <template v-if="!isFirstAuthenticatedLocalRef && displayIaSelectionTable">
      <v-main class="bg-default">
        <IAPage
          @IACodeSelected="IACodeSelected"
          :is-gestion="!isBroker"
          :brokers="brokersList"
          :delegations="delegations"
        ></IAPage>
      </v-main>
    </template>

    <template>
      <v-main class="bg-white">
        <v-container fluid>
          <v-overlay theme="light" z-index="7" class="text-center">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
            <p class="mt-4">{{ $t('page.loader.connexionLabel') }}</p>
          </v-overlay>
        </v-container>
      </v-main>
    </template>
    <Snackbar />
  </v-app>
</template>

<script setup lang="ts">
import Snackbar from '@/components/common/snackbar/SnackBar.vue';
import Navigation from '@/components/NavigationBar.vue';
import useAuth from '@/composables/authenticate/useAuth';
import useIasAndRole from '@/composables/authenticate/useIasAndRole';
import usePermissionMatrix from '@/composables/authenticate/usePermissionMatrix';
import useSnackBar from '@/composables/useSnackBar';
import IAPage from '@/views/pages/IAPageView.vue';
import type { Courtier } from 'open-api-espace-partenaire-souscription-typescript/dist/fr/cfdp/jaxrs/generated/espace-partenaire-souscription/skeleton/model';
import { onMounted, ref } from 'vue';
import { RouterView } from 'vue-router';
import { useRouter } from 'vue-router';
import { VApp, VContainer, VMain, VOverlay, VProgressCircular } from 'vuetify/components';
import { useI18n } from 'vue-i18n';
import vuetify from '@/plugins/vuetify';

/**
 * Définition des composables
 */
// const { refreshUserInfo, isAuthenticated, authenticate, authenticateWithIaCode } = useAuth();
const { isAuthenticatedComputed, login } = useAuth();
const { addMessageErrorSnackBarAction } = useSnackBar();
const router = useRouter();
const { roles } = usePermissionMatrix();
const { iasStore, roleStore } = useIasAndRole();

/**
 * Définition des references
 */
const brokersList = ref<Courtier[]>([]);
const delegations = ref<string[]>([]);
const isBroker = ref<boolean>();
const iaCodeSelected = ref<string>();
const isFirstAuthenticatedLocalRef = ref<boolean>(false);
const displayIaSelectionTable = ref(false);

const setIsFirstAuthenticatedLocalRef = () => {
  if (isAuthenticatedComputed.value) {
    isFirstAuthenticatedLocalRef.value = true;
  }
};

/**
 * Définition des constantes
 */
const ROUTE_LIST_DEVIS = '/devis-etablis';

const IACodeSelected = async (_iaCodeSelected: string): Promise<void> => {
  iaCodeSelected.value = _iaCodeSelected;
  displayIaSelectionTable.value = false;
  await login(iaCodeSelected.value);
  setIsFirstAuthenticatedLocalRef();
};

/**
 * Définition des fonctions
 */
const setDelegation = (iaCodesList: Courtier[]): void => {
  const delegationMap = Object.keys(iaCodesList).map((v) => iaCodesList[v].groupeComptable);
  delegations.value = [...new Set(delegationMap)];
};

const checkIAcodes = async (ias: Courtier[]): Promise<void> => {
  const nb = ias.length;

  if (nb > 1) {
    setDelegation(ias);
    displayIaSelectionTable.value = true;
  } else if (nb === 1) {
    const iaCode = ias[0].code;
    await login(iaCode);
    setIsFirstAuthenticatedLocalRef();
  } else {
    const titleError = '[App][checkIAcodes] Cas sans IA code.\n';
    addMessageErrorSnackBarAction(titleError);
  }
};

const firstAuthenticate = async (): Promise<void> => {
  brokersList.value = iasStore.value;
  const isRouteListeDevis = router.currentRoute.value.path === ROUTE_LIST_DEVIS;

  if (!isBroker.value && isRouteListeDevis) {
    await login();
    setIsFirstAuthenticatedLocalRef();
  } else {
    await checkIAcodes(iasStore.value);
  }
};

const setColorSubscriptor = (): void => {
  vuetify.theme.themes.value.dark.dark = isBroker.value;
};

const config = (): void => {
  setColorSubscriptor();
  isBroker.value = roleStore.value === roles.roleBroker;
};

onMounted(async () => {
  config();
  if (!isAuthenticatedComputed.value) {
    await firstAuthenticate();
  }
});
</script>
