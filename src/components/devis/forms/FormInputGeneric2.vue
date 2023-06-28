<template>
  <Form
    as="v-form"
    :validation-schema="schema"
    @submit="onSubmit"
    @invalid-submit="onInvalidSubmit"
  >
    <InputGeneric name="name" title="name" label="name" type="text" v-model="modelRef.emisPar" />
    {{ modelRef.emisPar }}

    <InputGeneric
      name="email"
      label="Email"
      type="text"
      title="email"
      value=""
      :is-required="true"
      v-model="modelRef.secteur"
    />
    {{ modelRef.secteur }}
    <v-btn color="primary" class="mr-4" type="submit"> Submit </v-btn>
  </Form>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate';
import * as yup from 'yup';
import InputGeneric from '@/components/common/form/InputGeneric.vue';
import { ref } from 'vue';
import type { DevisEntreprise } from 'open-api-souscription-typescript';

export interface IProps {
  data?: DevisEntreprise;
}

const props = withDefaults(defineProps<IProps>(), {
  data: () => ({}),
  takingStatusIntoAccount: false
});
const modelRef = ref<DevisEntreprise>(props.data);

const schema = yup.object({
  name: yup.string().required().label('Name'),
  // email: yup.string().email().required().label('E-mail'),
  email: yup.string().email().required().label('E-mail')
  // password: yup.string().min(6).required(),
  // passwordConfirm: yup
  //   .string()
  //   .oneOf([yup.ref('password')], 'Passwords must match')
  //   .required()
  //   .label('Password confirmation'),
  // terms: yup.boolean().required().oneOf([true], 'You must agree to terms and conditions')
});

function onSubmit(values) {
  console.log('Submitted with', values);
  console.log(' modelRef.value.emisPar', modelRef.value.emisPar);
  console.log(' modelRef.value.secteur', modelRef.value.secteur);
}
function onInvalidSubmit(values) {
  console.log('Not Submitted with', values.values);
  console.log(' modelRef.value.emisPar', modelRef.value.emisPar);
  console.log(' modelRef.value.secteur', modelRef.value.secteur);
}
</script>
