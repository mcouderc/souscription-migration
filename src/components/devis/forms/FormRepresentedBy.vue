<template>
  <v-col>
    <v-row>
      <v-col cols="4" v-if="props.representedByFormValueValidate.civilite?.visible">
        <SelectGeneric
          v-model="modelRef.civilite"
          input-id="civilite"
          :title="civilStatusTitleComputed"
          :items="civiliteRef"
          :is-required="
            isRequired(props.representedByFormValueValidate.civilite, takingStatusIntoAccount)
          "
          :is-disabled="
            isDisableHelper(
              props.representedByFormValueValidate.civilite,
              takingStatusIntoAccount,
              modelRef.civilite,
              props.representedByFormValueValidate.civilite.typage
            )
          "
          :max-length="25"
          @input="onEventInputAction(modelRef)"
          @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        />
      </v-col>
      <v-col cols="8">
        <InputGeneric
          v-if="props.representedByFormValueValidate.nom?.visible"
          input-class="text-uppercase"
          v-model="modelRef.nom"
          input-id="nom"
          value=""
          :title="$tc('forms.labels.name')"
          input-type="text"
          :is-required="
            isRequired(props.representedByFormValueValidate.nom, props.takingStatusIntoAccount)
          "
          :is-disabled="
            isDisableHelper(
              props.representedByFormValueValidate.nom,
              takingStatusIntoAccount,
              modelRef.nom,
              props.representedByFormValueValidate.nom.typage
            )
          "
          :max-length="150"
          @input="onEventInputAction(modelRef)"
          @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        />
      </v-col>
      <v-col cols="6" v-if="props.representedByFormValueValidate.prenom?.visible">
        <InputGeneric
          v-model="modelRef.prenom"
          input-id="prenom"
          value=""
          :title="$tc('forms.labels.firstName')"
          input-type="text"
          :is-required="
            isRequired(props.representedByFormValueValidate.prenom, props.takingStatusIntoAccount)
          "
          :is-disabled="
            isDisableHelper(
              props.representedByFormValueValidate.prenom,
              takingStatusIntoAccount,
              modelRef.prenom,
              props.representedByFormValueValidate.prenom.typage
            )
          "
          :max-length="150"
          @input="onEventInputAction(modelRef)"
          @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        />
      </v-col>
      <v-col cols="6" v-if="props.representedByFormValueValidate.qualite?.visible">
        <ComboboxGeneric
          v-model="modelRef.qualiteProfessionnelle"
          input-id="qualiteProfessionnelle"
          :title="$tc('forms.labels.quality')"
          :items="qualitiesRef"
          :is-required="
            isRequired(props.representedByFormValueValidate.qualite, props.takingStatusIntoAccount)
          "
          :is-disabled="
            isDisableHelper(
              props.representedByFormValueValidate.qualite,
              takingStatusIntoAccount,
              modelRef.qualiteProfessionnelle,
              props.representedByFormValueValidate.qualite.typage
            )
          "
          :max-length="150"
          @input="onEventInputAction(modelRef)"
          @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
        />
      </v-col>
    </v-row>
  </v-col>
</template>

<script setup lang="ts">
import InputGeneric from '@/components/common/form/InputGeneric.vue';
import SelectGeneric from '@/components/common/form/SelectGeneric.vue';
import ComboboxGeneric from '@/components/common/form/ComboboxGeneric.vue';
import { computed, ref, watch } from 'vue';
import type { DevisEntrepriseStatutEnum } from 'open-api-souscription-typescript';
import { useI18n } from 'vue-i18n';
import useConstante from '@/composables/useConstante';
import type { IRepresentePar } from '@/models/form_validate/interface/IRepresentePar';
import useFormValidate from '@/composables/useFormValidateHelper';
import type { DevisSouscripteurPersonnePhysique } from 'open-api-souscription-typescript';
import useQualities from '@/composables/useQualities';

export interface IProps {
  data?: DevisSouscripteurPersonnePhysique;
  statut?: DevisEntrepriseStatutEnum;
  takingStatusIntoAccount?: boolean;
  representedByFormValueValidate: IRepresentePar;
}

const { t } = useI18n();
const { CIVILITE } = useConstante();
const { qualities } = useQualities();
const civiliteRef = ref(CIVILITE);
const qualitiesRef = ref();
const props = withDefaults(defineProps<IProps>(), {
  takingStatusIntoAccount: false
});

const { isRequired, isDisableHelper } = useFormValidate();

const emit = defineEmits(['input', 'checkIfObjectIsSame']);

const onEventInputAction = (modelValue) => {
  emit('input', modelValue);
};

const onCheckIfObjectIsSameAction = (isSame: boolean) => {
  emit('checkIfObjectIsSame', isSame);
};

const modelRef = ref(props.data);

const civilStatusTitleComputed = computed(() => {
  return t('forms.labels.civilStatus');
});

watch(
  () => props.data,
  (newVal) => {
    modelRef.value = newVal;
  }
);

watch(
  () => qualities.value,
  (newVal) => {
    qualitiesRef.value = newVal;
  },
  { immediate: true }
);
</script>
<style scoped>
.col {
  padding-bottom: 0px;
}
</style>
