<template>
  <v-col>
    <v-row class="pb-2">
      <v-col cols="6">
        <!-- <TestFormVuetify
          :data="modelRef"
          :required="true"
          :taking-status-into-account="true"
        ></TestFormVuetify> -->
      </v-col>
      <v-col cols="6"> </v-col>
      <v-col cols="12">
        <!-- <TestFormVeeValidate :schema="formSchema"></TestFormVeeValidate> -->
        <FormInputGeneric2></FormInputGeneric2>
      </v-col>
    </v-row>
  </v-col>
</template>

<script setup lang="ts">
import type { DevisEntreprise } from 'open-api-souscription-typescript';

import '@/assets/stepByStep.css';
import { required } from '@vee-validate/rules';
import { ref, watch } from 'vue';
import useDevis from '@/composables/useDevis';
import TestFormVeeValidate from '@/components/devis/forms/TestFormVeeValidate.vue';
import * as Yup from 'yup';
import FormInputGeneric1 from '@/components/devis/forms/FormInputGeneric1.vue';
import FormInputGeneric2 from '@/components/devis/forms/FormInputGeneric2.vue';

const formSchema = {
  fields: [
    {
      label: 'Your Name',
      name: 'name',
      as: 'input'
      // rules: Yup.string().required()
    },
    {
      label: 'Your Email',
      name: 'email',
      as: 'input'
      // rules: Yup.string().email().required()
    },
    {
      label: 'Your Password',
      name: 'password',
      as: 'input',
      type: 'password'
      // rules: Yup.string().min(6).required()
    }
  ]
};

const { devis } = useDevis();
const modelRef = ref<DevisEntreprise>(devis.value);
</script>
