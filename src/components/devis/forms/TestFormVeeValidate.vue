<template>
  <Form @submit="submit" :validation-schema="schema" v-slot="{ errors }">
    <div v-for="field in formSchema.fields" :key="field.name">
      <label :for="field.name">{{ field.label }}</label>
      <Field class="mt-0 pt-0" :as="field.as" :id="field.name" :name="field.name" />
    </div>
    <!-- <Field name="email" /> -->
    <span>{{ errors.email }}</span>
    <!-- <Field name="password" type="password" /> -->
    <span>{{ errors.password }}</span>
    <button>Submit</button>
  </Form>
</template>
<script setup lang="ts">
import { Form, Field } from 'vee-validate';
import InputVeeValidate from './InputVeeValidate.vue';
const schema = {
  email: 'required|email',
  password: 'required|minLength:8'
};
const formSchema = {
  fields: [
    {
      label: 'Your Name',
      name: 'name',
      as: 'input'
    },
    {
      label: 'Your Email',
      name: 'email',
      as: 'input'
    },
    {
      label: 'Your Password',
      name: 'password',
      as: 'input'
    }
  ]
};

const submit = (values) => {
  console.log(values);
};
</script>
