<template>
  <v-expansion-panels v-model="panelOpenRef" flat multiple accordion>
    <v-expansion-panel class="border-grey info-devis-expansion-panel">
      <v-expansion-panel-header>
        <v-col cols="12">
          <h2 class="text-primary text-h6 text-capitalize">
            {{ props.title }}
          </h2>
        </v-col>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-container v-if="!isEtudeAndBroker()">
          <div v-if="isEtudeAndAdminAndDT()" class="d-flex align-baseline">
            <p>{{ $t('page.devisOverview.primeAnnuelHT') }} :</p>
            <input
              v-model="primeAnnuelleHTRef"
              cols="7"
              type="number"
              min="0"
              :max-length="150"
              class="input-ajust-tarif ml-2"
              @input="disabledSlider()"
            />
            <p class="ml-1">€</p>
          </div>

          <p>
            {{ $t('page.devisOverview.primeAvantVariation') }} : {{ getPrimeTtcReferenceComputed }}
          </p>
          <h4>{{ $t('page.devisOverview.primeTtc') }} : {{ getPrimeTtcAjusteeComputed }}</h4>

          <v-col v-if="!doesHavePermissionAmongRoleBrokerN2()">
            <h4 class="pl-0 d-flex justify-center">
              {{ $t('page.devisOverview.variationCommissionCourtier') }} :
              {{ comissionSliderRef }} %
            </h4>
            <div class="slider-limits">
              <label>0%</label>
              <label>{{ props.tauxCommissionCourtier }}%</label>
            </div>
            <v-slider
              class="slider"
              :disabled="checkIsDisabled()"
              :snap="true"
              :step="0.5"
              v-model="comissionSliderRef"
              thumb-label="always"
              :max="props.tauxCommissionCourtier"
              :min="0"
              @change="getSliderValue()"
            >
              <template v-slot:thumb-label="item"> {{ getParsedValue(item.value) }}% </template>
            </v-slider>
          </v-col>

          <v-col v-if="checkDisplaySlider()">
            <h4 class="pl-0 d-flex justify-center">
              {{ $t('page.devisOverview.variationPrimeTechnique') }} : {{ primeSliderRef }} %
            </h4>
            <div class="slider-limits">
              <label>{{ props.tauxVariationPrimeTechniqueMin }}%</label>
              <label>{{ props.tauxVariationPrimeTechniqueMax }}%</label>
            </div>
            <v-slider
              class="slider"
              :disabled="checkIsDisabled() || isDisabledPrimeVariationRef"
              :snap="true"
              :step="0.5"
              v-model="primeSliderRef"
              thumb-label="always"
              :max="props.tauxVariationPrimeTechniqueMax"
              :min="props.tauxVariationPrimeTechniqueMin"
              @change="getSliderValue()"
            >
              <template v-slot:thumb-label="item">
                {{ getParsedValue(item.value) }}%
              </template></v-slider
            >
          </v-col>
          <div v-if="!doesHavePermissionAmongRoleBrokerN2()" class="d-flex justify-center mb-2">
            <v-btn
              color="primary"
              @click="calculatePrice()"
              :disabled="checkIsDisabled() || disableBtnRef"
            >
              {{ $t('page.devisOverview.calculateTarif') }}
            </v-btn>
          </div>
        </v-container>
        <v-container v-else>
          {{ $t('page.tarification.etudeNecessaireAjustTarif') }}
        </v-container>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script setup lang="ts">
import usePermission from '@/composables/authenticate/usePermission';
import formatDataConsultDevis from '@/services/formatDataConsultDevis';
import {
  DevisStatutEnum,
  type DevisEntreprise,
  type TauxVariationData
} from 'open-api-souscription-typescript';
import { computed, onMounted, ref } from 'vue';

import type VueI18n from 'vue-i18n';

export interface IProps {
  title?: VueI18n.TranslateResult;
  devis: DevisEntreprise;
  primeTTCReference?: number;
  primeTTCAjusteeNonArrondi?: number;
  tauxCommissionCourtier?: number;
  tauxVariationPrimeTechniqueMax?: number;
  tauxVariationPrimeTechniqueMin?: number;
}

const props = withDefaults(defineProps<IProps>(), {});

const tauxCommissionIaAjusteRef = ref(0);
const tauxVariationPrimeTechniqueRef = ref(0);
const primeAnnuelleHTRef = ref(0);
const disableBtnRef = ref<boolean>(true);
const comissionSliderRef = ref(0);
const isDisabledPrimeVariationRef = ref<boolean>(false);
const primeSliderRef = ref(0);
const panelOpenRef = ref([0]);
const recalculTarifRef = ref<TauxVariationData>({});
const {
  doesHavePermissionAmongAllRolesButBrokerAndConsultationAndDelegate,
  doesHavePermissionAmongAllRolesButBrokerAndConsultation,
  doesHavePermissionAmongAllRolesButConsultation,
  doesHavePermissionAmongAllRolesButBroker,
  doesHavePermissionAmongRoleBroker,
  doesHavePermissionAmongRoleBrokerN2
} = usePermission();

const { formatAmount } = formatDataConsultDevis();

const emit = defineEmits(['tarifValues', 'buttonEmisDisabled']);

const getSliderValue = () => {
  primeAnnuelleHTRef.value = 0;
  emit('buttonEmisDisabled', { needRecalcule: true });
  disableBtnRef.value = false;
  tauxCommissionIaAjusteRef.value = comissionSliderRef.value;
  tauxVariationPrimeTechniqueRef.value = primeSliderRef.value;
};

const calculatePrice = () => {
  recalculTarifRef.value.primeHtRevisee = Number(primeAnnuelleHTRef.value) || 0;
  recalculTarifRef.value.tauxCommissionIaAjuste = tauxCommissionIaAjusteRef.value;
  recalculTarifRef.value.tauxVariationPrimeTechnique = tauxVariationPrimeTechniqueRef.value;
  emit('tarifValues', recalculTarifRef.value);
  emit('buttonEmisDisabled', { needRecalcule: false });
  disableBtnRef.value = true;
};

const getParsedValue = (value: string) => {
  return parseFloat(value).toFixed(2);
};

const isEtudeAndBroker = () => {
  return (
    (props.devis.statut === DevisStatutEnum.EnEtudeN1 ||
      props.devis.statut === DevisStatutEnum.EnEtudeN2) &&
    doesHavePermissionAmongRoleBroker()
  );
};

const isEtudeAndAdminAndDT = () => {
  return (
    (props.devis.statut === DevisStatutEnum.EnEtudeN1 ||
      props.devis.statut === DevisStatutEnum.EnEtudeN2) &&
    doesHavePermissionAmongAllRolesButBrokerAndConsultationAndDelegate()
  );
};

const disabledSlider = () => {
  isDisabledPrimeVariationRef.value = primeAnnuelleHTRef.value > 0;
};

const checkIsDisabled = (): boolean => {
  return (
    props.devis?.statut === DevisStatutEnum.BrouillonEnCours ||
    props.devis?.statut === DevisStatutEnum.Emis ||
    props.devis?.statut === DevisStatutEnum.Expire ||
    props.devis?.statut === DevisStatutEnum.Refuse ||
    props.devis?.statut === DevisStatutEnum.Transforme ||
    (props.devis?.statut === DevisStatutEnum.EnEtudeN1 &&
      !doesHavePermissionAmongAllRolesButBrokerAndConsultation()) ||
    (props.devis?.statut === DevisStatutEnum.EnEtudeN2 &&
      !doesHavePermissionAmongAllRolesButBrokerAndConsultationAndDelegate()) ||
    !doesHavePermissionAmongAllRolesButConsultation()
  );
};

const checkDisplaySlider = () => {
  return (
    props.tauxVariationPrimeTechniqueMin < props.tauxVariationPrimeTechniqueMax &&
    doesHavePermissionAmongAllRolesButBroker()
  );
};

const getPrimeTtcAjusteeComputed = computed(() => {
  return `${formatAmount(props?.devis?.primeTtc) ?? 'No value'}`;
});

const getPrimeTtcReferenceComputed = computed(() => {
  return `${
    formatAmount(props.devis?.primeTtcAvantVariation) ??
    formatAmount(props.devis?.primeTtc) ??
    'No value'
  }`;
});

onMounted(() => {
  comissionSliderRef.value = props.devis.tauxDeCommissionAjuste ?? props.tauxCommissionCourtier;
  primeSliderRef.value = props.devis?.tauxVariationPrimeTechnique ?? 0;
});
</script>
<style scope>
.d-flex {
  display: flex;
}
.justify-content-between {
  justify-content: space-between;
}
.slider .v-slider__thumb-label-container .primary {
  position: absolute;
  font-size: 14px;
  top: 20px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.87);
  background-color: transparent !important;
  left: 2px;
}
.slider-limits {
  display: flex;
  justify-content: space-between;
}
.input-ajust-tarif {
  border-style: solid;
  max-width: 100px;
}
</style>
