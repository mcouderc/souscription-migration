<template>
  <Form
    as="v-form"
    :validation-schema="schema"
    @submit="onSubmit"
    @invalid-submit="onInvalidSubmit"
  >
    <v-col>
      <v-row class="pb-2">
        <v-col cols="6">
          <FormRisk
            :data="modelRef"
            :description-risk-form-value-validate="formValidateApplyComputed.descriptionRisque"
          ></FormRisk>
        </v-col>
        <v-col cols="6"> </v-col>
        <v-col cols="12">
          <!-- <TestFormVeeValidate :schema="formSchema"></TestFormVeeValidate> -->
          <FormInputGeneric3 :data="modelRef"></FormInputGeneric3>
        </v-col>
      </v-row>
    </v-col>
    <v-btn color="primary" class="mr-4" type="submit"> Submit </v-btn>
  </Form>
</template>

<script setup lang="ts">
import type { DevisEntreprise } from 'open-api-souscription-typescript';
import { Form } from 'vee-validate';
import '@/assets/stepByStep.css';
import { computed, ref } from 'vue';
import FormInputGeneric3 from '@/components/devis/forms/FormInputGeneric3.vue';
import FormRisk from '@/components/devis/forms/FormRisk.vue';
import useFormValidate from '@/composables/useFormValidateHelper';
import * as yup from 'yup';

export interface IProps {
  data?: DevisEntreprise;
}

const props = withDefaults(defineProps<IProps>(), {
  data: () => ({}),
  takingStatusIntoAccount: false
});
const modelRef = ref<DevisEntreprise>(props.data);

const { getFormValidateFollowingTypeRisk } = useFormValidate();

const formValidateApplyComputed = computed(() => {
  return getFormValidateFollowingTypeRisk(modelRef.value.typeRisque);
});

const schema = yup.object({
  emisPar: yup.string().required().label('Emis Par'),
  secteur: yup.string().required().label('Secteur'),
  numberVehicles: yup.number().required().label('Nombre de Vehicules'),
  nombreResidencesSecondaires: yup.number().required().label('nombre de Residences Secondaires')
});

function onSubmit(values) {
  modelRef.value.emisPar = values.emisPar;
  console.log('Submitted with', values);
  console.log(' modelRef.value.emisPar', modelRef.value.emisPar);
  console.log(' modelRef.value.secteur', modelRef.value.secteur);
  console.log(' modelRef.value.nombreVehicules', modelRef.value.nombreVehicules);
  console.log(
    ' modelRef.value.nombreResidencesSecondaires',
    modelRef.value.nombreResidencesSecondaires
  );
}
function onInvalidSubmit(values) {
  console.log('Not Submitted with', values.values);
  console.log(' modelRef.value.emisPar', modelRef.value.emisPar);
  console.log(' modelRef.value.secteur', modelRef.value.secteur);
  console.log(' modelRef.value.nombreVehicules', modelRef.value.nombreVehicules);
  console.log(
    ' modelRef.value.nombreResidencesSecondaires',
    modelRef.value.nombreResidencesSecondaires
  );
}
</script>
