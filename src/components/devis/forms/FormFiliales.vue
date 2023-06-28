<template>
  <v-col>
    <v-row>
      <v-col cols="12" class="mb-5">
        <p class="mb-5 grey-darken-1&#45;&#45;text" v-if="!inputRequireComputed">
          {{ $t('page.branch.title') }}
        </p>
        <TableWithDialogDevis
          :header="hedersFilialeDynamic()"
          :items-list="modelRef.filiales"
          :item-to-edit="modelFilialesRef"
          :market="modelRef.typeRisque"
          :disabled="props.buttonDisabled"
          :collection="COLLECTION.FILIALES"
          :is-to-contrat="inputRequireComputed"
          :add-button-text="$t('forms.buttons.addBranch')"
          @itemsListUpdated="filialeUpdated"
          @resetEditedItem="filialeResetInputValue"
          @loadEditedItem="filialeLoadDataToEdit"
        >
          <template #edit>
            <DialogFiliale
              v-model="modelFilialesRef"
              :statut="devis.statut"
              :market="modelRef.typeRisque"
              :filiale-value-validate="props.filialeValueValidate"
            />
          </template>
        </TableWithDialogDevis>
      </v-col>
    </v-row>
  </v-col>
</template>

<script setup lang="ts">
import DialogFiliale from './DialogFiliale.vue'; //TODO : A remettre apres la merge request
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import useConstante from '@/composables/useConstante';
import useDevis from '@/composables/useDevis';
import TableWithDialogDevis from '../TableWithDialogDevis.vue';
import { DevisEntrepriseTypeRisqueEnum } from 'open-api-souscription-typescript';
import { DevisEntrepriseStatutEnum } from 'open-api-souscription-typescript';
import type { IFilialeValidate } from '@/models/form_validate/interface/IFilialeValidate';
import type { DataTableHeader } from 'vuetify';

export interface IProps {
  data: any;
  takingStatusIntoAccount?: boolean;
  filialeValueValidate?: IFilialeValidate;
  buttonDisabled?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  data: {},
  takingStatusIntoAccount: false,
  buttonDisabled: false
});

const { COLLECTION } = useConstante();
const { devis } = useDevis();

const modelFilialesRef = ref({});
const modelRef = ref(props.data);

const hedersFilialeDynamic = (): DataTableHeader[] => {
  const header = [
    { text: i18n.tc('forms.labels.companyName'), value: 'raisonSociale' },
    { text: i18n.tc('forms.labels.siret'), value: 'identifiantLegal' }
  ];
  if (modelRef.value.typeRisque !== DevisEntrepriseTypeRisqueEnum.Agricole) {
    header.push({ text: i18n.tc('forms.labels.nafCode'), value: 'codeNaf' });
  } else {
    header.push({ text: i18n.tc('forms.labels.activity'), value: 'activite' });
  }
  header.push({ text: i18n.tc('forms.labels.countries'), value: 'adresse.pays' });
  return header;
};

const inputRequireComputed = computed(() => {
  return props.takingStatusIntoAccount
    ? modelRef?.value.statut === DevisEntrepriseStatutEnum.Emis
    : false;
});

const filialeUpdated = (data) => {
  modelRef.value.filiales = data.value;
};

const filialeResetInputValue = () => {
  modelFilialesRef.value = {};
};

const filialeLoadDataToEdit = (data) => {
  modelFilialesRef.value = data;
};

watch(
  () => props.data,
  (nv) => (modelRef.value = nv)
);
</script>
