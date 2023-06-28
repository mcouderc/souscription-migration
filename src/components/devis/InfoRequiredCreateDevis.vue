<template>
  <div>
    <p>{{ titleRequiredData() }}</p>

    <v-list dense class="text-sm">
      <div v-show="!devis.id">
        <template v-if="props.personneMorale">
          <v-list-item v-if="inputRequireComputed && props.siretIsRequired" class="pa-0">
            <v-icon
              v-if="checkFormatSiret() && modelRef.souscripteurPersonneMorale.identifiantLegal"
              color="green"
              small
            >
              mdi-checkbox-marked-circle</v-icon
            >
            <v-icon v-else color="red" small>mdi-close-circle</v-icon>
            <label for="identifiantLegal" class="pl-5 cursor-pointer">
              {{ $t('forms.labels.siret') }}
            </label>
          </v-list-item>
          <v-list-item class="pa-0">
            <v-icon v-if="modelRef.souscripteurPersonneMorale.raisonSociale" color="green" small>
              mdi-checkbox-marked-circle
            </v-icon>
            <v-icon v-else small color="red">mdi-close-circle</v-icon>
            <label for="raisonSociale" class="cursor-pointer pl-5">
              {{ $t('forms.labels.companyName') }}
            </label>
          </v-list-item>
          <v-list-item class="pa-0">
            <v-icon
              v-if="modelRef.souscripteurPersonneMorale?.adresse?.adresse1"
              color="green"
              small
            >
              mdi-checkbox-marked-circle
            </v-icon>
            <v-icon v-else color="red" small>mdi-close-circle</v-icon>
            <label for="autoCompletion-addresse" class="pl-5 cursor-pointer">
              {{ $t('forms.labels.address') }}
            </label>
          </v-list-item>
          <v-list-item class="pa-0">
            <v-icon
              v-if="modelRef.souscripteurPersonneMorale?.adresse?.codePostal"
              color="green"
              small
              >mdi-checkbox-marked-circle</v-icon
            >
            <v-icon v-else color="red" small>mdi-close-circle</v-icon>
            <label for="codePostal" class="pl-5 cursor-pointer">
              {{ $t('forms.labels.cityCode') }}
            </label>
          </v-list-item>
          <v-list-item class="pa-0">
            <v-icon v-if="modelRef.souscripteurPersonneMorale?.adresse?.ville" color="green" small
              >mdi-checkbox-marked-circle</v-icon
            >
            <v-icon v-else color="red" small>mdi-close-circle</v-icon>
            <label for="autoCompletion-ville" class="pl-5 cursor-pointer">
              {{ $t('forms.labels.city') }}
            </label>
          </v-list-item>
        </template>

        <template v-else>
          <v-list-item class="pa-0">
            <v-icon v-if="modelRef.souscripteurPersonnePhysique.nom" color="green" small>
              mdi-checkbox-marked-circle
            </v-icon>
            <v-icon v-else color="red" small>mdi-close-circle</v-icon>
            <label for="nom" class="pl-5 cursor-pointer">
              {{ $t('forms.labels.name') }}
            </label>
          </v-list-item>
          <v-list-item class="pa-0">
            <v-icon v-if="modelRef.souscripteurPersonnePhysique.prenom" color="green" small>
              mdi-checkbox-marked-circle
            </v-icon>
            <v-icon v-else color="red" small>mdi-close-circle</v-icon>
            <label for="prenom" class="pl-5 cursor-pointer">
              {{ $t('forms.labels.firstName') }}
            </label>
          </v-list-item>
          <v-list-item class="pa-0">
            <v-icon
              v-if="modelRef.souscripteurPersonnePhysique.adresse.adresse1"
              color="green"
              small
            >
              mdi-checkbox-marked-circle
            </v-icon>
            <v-icon v-else color="red" small>mdi-close-circle</v-icon>
            <label for="adresse1" class="pl-5 cursor-pointer">
              {{ $t('forms.labels.address') }}
            </label>
          </v-list-item>
          <v-list-item class="pa-0">
            <v-icon
              v-if="modelRef.souscripteurPersonnePhysique.adresse.codePostal"
              color="green"
              small
              >mdi-checkbox-marked-circle</v-icon
            >
            <v-icon v-else color="red" small>mdi-close-circle</v-icon>
            <label for="codePostal" class="pl-5 cursor-pointer">
              {{ $t('forms.labels.cityCode') }}
            </label>
          </v-list-item>
          <v-list-item class="pa-0">
            <v-icon v-if="modelRef.souscripteurPersonnePhysique.adresse.ville" color="green" small>
              mdi-checkbox-marked-circle
            </v-icon>
            <v-icon v-else color="red" small>mdi-close-circle</v-icon>
            <label for="ville" class="pl-5 cursor-pointer">
              {{ $t('forms.labels.city') }}
            </label>
          </v-list-item>
        </template>
      </div>
      <div v-show="devis.id && listErrorsObserverRef?.length">
        <v-list-item v-for="fields in listErrorsObserverRef" class="pa-0" :key="fields.id">
          <v-icon color="red" small>mdi-close-circle</v-icon>
          <label :for="fields.id" class="pl-5 cursor-pointer">
            {{ fields.name }}
          </label>
        </v-list-item>
      </div>
    </v-list>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type VueI18n from 'vue-i18n';
import useDevis from '@/composables/useDevis';
import useConstante from '@/composables/useConstante';
import validationRulesSiret from '@/services/validationRulesSiret';
import { DevisEntrepriseStatutEnum, type DevisEntreprise } from 'open-api-souscription-typescript';

export interface IProps {
  model?: DevisEntreprise;
  statut?: string;
  listErrorsObserver?: any;
  personneMorale?: boolean;
  siretIsRequired?: boolean;
  takingStatusIntoAccount?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  model: null,
  validationObserver: null,
  listErrorsObserver: null,
  personneMorale: true
});
const { t } = useI18n();
const { siretIsValid } = validationRulesSiret();
const { devis } = useDevis();
const { COLLECTION } = useConstante();

const listErrorsObserverRef = ref(null);
const modelRef = ref(props.model);

const inputRequireComputed = computed(() => {
  return props.takingStatusIntoAccount ? props.statut === DevisEntrepriseStatutEnum.Emis : false;
});

const titleRequiredData = (): VueI18n.TranslateResult => {
  if (listErrorsObserverRef?.value?.length === 0) {
    return t('components.inputsEmpty');
  } else if (!modelRef.value.id) {
    return t('components.inputsRequiredDevis');
  } else if (inputRequireComputed.value) {
    return t('components.inputsRequiredContrat');
  } else {
    return t('components.inputsRequiredDevisCreate');
  }
};

const checkFormatSiret = (): boolean => {
  return siretIsValid(
    modelRef.value.souscripteurPersonneMorale.identifiantLegal,
    modelRef.value.souscripteurPersonneMorale.adresse?.pays
  );
};

const collectionFormat = (newVal) => {
  listErrorsObserverRef.value = [];
  newVal.forEach((field) => {
    const nameColectionField = field.id.split('-')[field.id?.split('-').length - 1];
    if (Object.values(COLLECTION).includes(nameColectionField)) {
      if (!listErrorsObserverRef.value.find((e) => Object.values(COLLECTION).includes(e.id))) {
        listErrorsObserverRef.value.push({ id: nameColectionField, name: nameColectionField });
      }
    } else {
      listErrorsObserverRef.value.push(field);
    }
  });
};

watch(
  () => props.listErrorsObserver,
  (newVal) => {
    collectionFormat(newVal);
  },
  { deep: true }
);
</script>

<style scoped>
.v-list-item--dense,
.v-list--dense .v-list-item {
  min-height: 30px;
}
</style>
