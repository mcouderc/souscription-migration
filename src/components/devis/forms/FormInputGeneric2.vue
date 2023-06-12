<template>
  <Form
    as="v-form"
    :validation-schema="schema"
    @submit="onSubmit"
    @invalid-submit="onInvalidSubmit"
  >
    <!-- This method uses Higher-order component API to validate vuetify inputs -->
    <!-- <Field name="name" v-slot="{ field, errors }">
      <v-text-field v-bind="field" label="Name" :error-messages="errors" />
    </Field> -->

    <TextFieldWithValidation
      name="name"
      title="name"
      label="name"
      type="text"
      value=""
      v-model="modelRef.emisPar"
      :is-required="true"
    />

    <!-- This uses a custom component with the composition API -->
    <TextFieldWithValidation name="email" label="Email" type="email" title="email" />

    <!-- This uses a custom component with the composition API -->
    <TextFieldWithValidation name="password" label="Password" type="password" title="password" />

    <!-- This uses a custom component with the composition API -->
    <!-- <TextFieldWithValidation name="passwordConfirm" label="Password Confirmation" type="password" /> -->

    <!-- Same thing for other types of components -->
    <!-- In case of checkboxes you need to explicitly bind the model events -->
    <!-- With composition it is easier since you can use the `v-model` API directly -->
    <Field name="terms" :value="true" type="checkbox" v-slot="{ value, handleChange, errors }">
      <v-checkbox
        :model-value="value"
        @update:modelValue="handleChange"
        label="Do you agree?"
        color="primary"
        :error-messages="errors"
      />
    </Field>

    <v-btn color="primary" class="mr-4" type="submit"> Submit </v-btn>
  </Form>
</template>

<script setup lang="ts">
import { Field, Form } from 'vee-validate';
import * as yup from 'yup';
import TextFieldWithValidation from '@/components/common/form/InputGeneric2.vue';
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
  email: yup.string().email().required().label('E-mail'),
  password: yup.string().min(6).required(),
  // passwordConfirm: yup
  //   .string()
  //   .oneOf([yup.ref('password')], 'Passwords must match')
  //   .required()
  //   .label('Password confirmation'),
  terms: yup.boolean().required().oneOf([true], 'You must agree to terms and conditions')
});

function onSubmit(values) {
  console.log('Submitted with', values);
  console.log(' modelRef.value.emisPar', modelRef.value.emisPar);
}
function onInvalidSubmit(values) {
  console.log('Not Submitted with', values.values);
  console.log(' modelRef.value.emisPar', modelRef.value.emisPar);
}
</script>
