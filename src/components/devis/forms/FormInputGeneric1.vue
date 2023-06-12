<template>
  <Form
    as="v-form"
    :validation-schema="schema"
    @submit="onSubmit"
    @invalid-submit="onInvalidSubmit"
  >
    <InputGeneric1Vue
      v-model="modelRef.nombreVehicules"
      input-id="nombreVehicules"
      :title="$tc('page.additionalInformation.numberVehicles')"
      input-type="number"
      value=""
      @input="onEventInputAction(modelRef)"
      @checkIfObjectIsSame="onCheckIfObjectIsSameAction(true)"
    ></InputGeneric1Vue>
    <button>Submit</button>
  </Form>
</template>

<script setup lang="ts">
import { Form, Field, useForm } from 'vee-validate';
import InputVeeValidate from './InputVeeValidate.vue';
import InputGeneric1Vue from '@/components/common/form/InputGeneric1.vue';
import InputGeneric2Vue from '@/components/common/form/InputGeneric2.vue';
import type { DevisEntreprise } from 'open-api-souscription-typescript';
import { computed, onMounted, ref } from 'vue';
import type { IDescriptionRisque } from '@/models/form_validate/interface/IDescriptionRisque';
import * as Yup from 'yup';

export interface IProps {
  data?: DevisEntreprise;
}

const props = withDefaults(defineProps<IProps>(), {
  data: () => ({}),
  takingStatusIntoAccount: false
});

const modelRef = ref<DevisEntreprise>(props.data);

const schema = Yup.object().shape({
  nombreVehicules: Yup.number().required()
});

onMounted(async () => {
  console.log('🚀 \n Form props', props.data);
});

const { errors } = useForm({
  validationSchema: schema
});
const emit = defineEmits(['input', 'checkIfObjectIsSame']);

const onEventInputAction = (modelValue) => {
  emit('input', modelValue);
};
const onCheckIfObjectIsSameAction = (isSame: boolean) => {
  emit('checkIfObjectIsSame', isSame);
};

const onInvalidSubmit = computed((values) => {
  return console.log(values);
});
const onSubmit = computed((values) => {
  return console.log(values);
});
</script>
