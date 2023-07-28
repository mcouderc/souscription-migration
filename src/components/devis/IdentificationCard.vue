<template>
  <div v-if="Object.keys(props.profil).length > 0">
    <p class="font-semibold">
      {{ props.profil.nom_entreprise }}
    </p>
    <div class="text-sm">
      <v-row v-for="{ label, value } in profilFilteredComputed" :key="label">
        <v-col cols="5" class="py-0">{{ label }}:</v-col>
        <v-col class="py-0"> {{ value }}</v-col>
      </v-row>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type IPapperEntreprise from '@/models/IPapperEntreprise';

export interface IProps {
  profil: any;
}
const props = withDefaults(defineProps<IProps>(), {
  profil: {} as IPapperEntreprise
});
const { t } = useI18n();

const profilFilteredComputed = computed(() => {
  return {
    denomination: {
      label: t('forms.labels.corporateName'),
      value: props.profil.denomination
    },
    siege: {
      label: t('forms.labels.headquarters'),
      value: `${props.profil.siege.adresse_ligne_1 || ''} ${
        props.profil.siege.adresse_ligne_2 || ''
      } ${props.profil.siege.code_postal || ''} ${props.profil.siege.ville || ''}`
    },
    siret: {
      label: t('forms.labels.siret'),
      value: props.profil.siege.siret_formate
    },
    domaine_activite: {
      label: t('forms.labels.areaOfActivity'),
      value: props.profil.domaine_activite
    },
    code_naf: {
      label: t('forms.labels.nafCode'),
      value: `${props.profil.code_naf} - ${props.profil.libelle_code_naf}`
    },

    effectif: { label: t('forms.labels.employees'), value: props.profil.effectif },
    chiffre_affaires: {
      label: t('forms.labels.turnover'),
      value: props.profil.chiffre_affaires
    },
    date_creation: {
      label: t('forms.labels.createdDate'),
      value: props.profil.date_creation_formate
    }
  };
});
</script>
