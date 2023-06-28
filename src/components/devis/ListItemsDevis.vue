<template>
  <div>
    <v-data-table
      :headers="headerComputed"
      :items="arrayItemsComputed"
      class="elevation-1 mt-5"
      @pagination="pageChange"
    >
      <template v-slot:[`item.actions`]="{ index, item }">
        <td class="text-right">
          <v-btn
            icon
            @click="
              onEventUpdateItemAction({
                item,
                position: index,
                pageWithPagination: pagePaginationRef
              })
            "
            v-if="props.showBtnAdd"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            icon
            color="error"
            @click="onEventRemoveItemPositionAction(index)"
            v-if="props.showBtnDelete && !props.isToContrat"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </td>
      </template>
      <template
        v-slot:[`item.adresse1`]="{ index, item }"
        v-if="devis.typeRisque === DevisEntrepriseTypeRisqueEnum.Particulier"
      >
        <validation-provider
          v-slot="{ errors }"
          name="Adresse"
          :vid="`Adresse-${index}-${props.collection}`"
          :rules="isRequiredTableau(item.adresse1)"
        >
          <td :error-messages="errors">
            <span v-if="!item.adresse1" class="red--text">{{ errors[0] }}</span>
            <span v-else>{{ item?.adresse1 }}</span>
          </td>
        </validation-provider>
      </template>
      <template v-slot:[`item.adresse?.adresse1`]="{ index, item }" v-if="isProOrPno()">
        <validation-provider
          v-slot="{ errors }"
          name="Adresse"
          :vid="`Adresse-${index}-${props.collection}`"
          :rules="isRequiredTableau(item?.adresse?.adresse1)"
        >
          <td :error-messages="errors">
            <span v-if="!item.adresse?.adresse1" class="red--text">{{ errors[0] }}</span>
            <span v-else>{{ item.adresse?.adresse1 }}</span>
          </td>
        </validation-provider>
      </template>
      <template
        v-if="devis.typeRisque === DevisEntrepriseTypeRisqueEnum.Particulier"
        v-slot:[`item.codePostal`]="{ index, item }"
      >
        <validation-provider
          v-slot="{ errors }"
          name="Code Postal"
          :vid="`Code Postal-${index}-${props.collection}`"
          :rules="isRequiredTableau(item.codePostal)"
        >
          <td :error-messages="errors">
            <span v-if="!item.codePostal" class="red--text">{{ errors[0] }}</span>
            <span v-else>{{ item.codePostal }}</span>
          </td>
        </validation-provider>
      </template>
      <template v-if="isProOrPno()" v-slot:[`item.adresse?.codePostal`]="{ index, item }">
        <validation-provider
          v-slot="{ errors }"
          name="Code Postal"
          :vid="`Code Postal-${index}-${props.collection}`"
          :rules="isRequiredTableau(item.adresse?.codePostal)"
        >
          <td :error-messages="errors">
            <span v-if="!item.adresse.codePostal" class="red--text">{{ errors[0] }}</span>
            <span v-else>{{ item.adresse?.codePostal }}</span>
          </td>
        </validation-provider>
      </template>
      <template
        v-if="devis.typeRisque === DevisEntrepriseTypeRisqueEnum.Particulier"
        v-slot:[`item.ville`]="{ index, item }"
      >
        <validation-provider
          v-slot="{ errors }"
          name="Ville"
          :vid="`Ville-${index}-${props.collection}`"
          :rules="isRequiredTableau(item.ville)"
        >
          <td :error-messages="errors">
            <span v-if="!item.ville" class="red--text">{{ errors[0] }}</span>
            <span v-else> {{ item.ville }}</span>
          </td>
        </validation-provider>
      </template>
      <template v-if="isProOrPno()" v-slot:[`item.adresse?.ville`]="{ index, item }">
        <validation-provider
          v-slot="{ errors }"
          name="Ville"
          :vid="`Ville-${index}-${props.collection}`"
          :rules="isRequiredTableau(item.adresse?.ville)"
        >
          <td :error-messages="errors">
            <span v-if="!item.adresse.ville" class="red--text">{{ errors[0] }}</span>
            <span v-else> {{ item.adresse?.ville }}</span>
          </td>
        </validation-provider>
      </template>
      <template
        v-if="devis.typeRisque === DevisEntrepriseTypeRisqueEnum.Particulier"
        v-slot:[`item.pays`]="{ index, item }"
      >
        <validation-provider
          v-slot="{ errors }"
          name="Pays"
          :vid="`Pays-${index}-${props.collection}`"
          :rules="isRequiredTableau(item.pays)"
        >
          <td :error-messages="errors">
            <span v-if="!item.pays" class="red--text">{{ errors[0] }}</span>
            <span v-else>{{ item.pays }}</span>
          </td>
        </validation-provider>
      </template>
      <template v-if="isProOrPno()" v-slot:[`item.adresse?.pays`]="{ index, item }">
        <validation-provider
          v-slot="{ errors }"
          name="Pays"
          :vid="`Pays-${index}-${props.collection}`"
          :rules="isRequiredTableau(item.adresse?.pays)"
        >
          <td :error-messages="errors">
            <span v-if="!item.adresse.pays" class="red--text">{{ errors[0] }}</span>
            <span v-else>{{ item.adresse?.pays }}</span>
          </td>
        </validation-provider>
      </template>
      <template
        v-if="devis.typeRisque === DevisEntrepriseTypeRisqueEnum.ProfessionnelEntreprise"
        v-slot:[`item.raisonSociale`]="{ index, item }"
      >
        <validation-provider
          v-slot="{ errors }"
          name="Raison sociale"
          :vid="`Raison sociale-${index}-${props.collection}`"
          :rules="isRequiredTableau(item.raisonSociale)"
        >
          <td :error-messages="errors">
            <span v-if="!item.raisonSociale" class="red--text">{{ errors[0] }}</span>
            <span v-else>{{ item.raisonSociale }}</span>
          </td>
        </validation-provider>
      </template>
      <template
        v-if="devis.typeRisque === DevisEntrepriseTypeRisqueEnum.ProfessionnelEntreprise"
        v-slot:[`item.identifiantLegal`]="{ index, item }"
      >
        <validation-provider
          v-slot="{ errors }"
          name="Identifiant Légal"
          :vid="`Identifiant légal-${index}-${props.collection}`"
        >
          <td :error-messages="errors">
            <span v-if="!item.identifiantLegal" class="red--text">{{ errors[0] }}</span>
            <span v-else>{{ item.identifiantLegal }}</span>
          </td>
        </validation-provider>
      </template>
    </v-data-table>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { ValidationProvider } from 'vee-validate';
import { DevisEntrepriseTypeRisqueEnum } from 'open-api-souscription-typescript';
import { DevisEntrepriseStatutEnum } from 'open-api-souscription-typescript';
import useDevis from '@/composables/useDevis';
import type { DataTableHeader, DataOptions } from 'vuetify';

export interface IProps {
  header: any[];
  arrayItems?: any[];
  showBtnDelete?: boolean;
  showBtnAdd?: boolean;
  showBtnAddDialog?: boolean;
  isToContrat?: boolean;
  statut?: string;
  takingStatusIntoAccount?: boolean;
  collection: string;
}

const props = withDefaults(defineProps<IProps>(), {
  header: () => [],
  arrayItems: () => [],
  showBtnDelete: true,
  showBtnAdd: true,
  isToContrat: false,
  statut: '',
  takingStatusIntoAccount: false
});

const { devis } = useDevis();
const pagePaginationRef = ref<DataOptions>();
const emit = defineEmits(['updateItem', 'removeItemPosition']);
const onEventUpdateItemAction = (modelValue) => {
  emit('updateItem', modelValue);
};
const pageChange = (paginationActuelle: DataOptions) => {
  pagePaginationRef.value = paginationActuelle;
};
const onEventRemoveItemPositionAction = (index) => {
  emit('removeItemPosition', index);
};

const isProOrPno = () => {
  return (
    devis.value.typeRisque === DevisEntrepriseTypeRisqueEnum.ProfessionnelEntreprise ||
    devis.value.typeRisque === DevisEntrepriseTypeRisqueEnum.Proprietaire
  );
};

const headerComputed = computed(() => {
  const headerComputed: DataTableHeader[] = props.header.map((item) => {
    return {
      text: item.text,
      align: 'start',
      sortable: false,
      value: item.value
    };
  });
  headerComputed.push({ text: '', width: '105px', sortable: false, value: 'actions' });

  return headerComputed;
});

const arrayItemsComputed = computed(() => {
  return props.arrayItems;
});

const inputRequireComputed = computed((): boolean => {
  return props.takingStatusIntoAccount ? props.statut === DevisEntrepriseStatutEnum.Emis : false;
});

const isRequiredTableau = (input: string): string => {
  return !input && inputRequireComputed.value ? 'required' : '';
};
</script>
