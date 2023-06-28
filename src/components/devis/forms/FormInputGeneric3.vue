<template>
  <div>
    <label> {{ modelRef.emisPar }} </label>
    <InputGeneric
      name="emisPar"
      title="emisPar"
      label="emisPar"
      type="text"
      v-model="modelRef.emisPar"
    />
    <label> {{ modelRef.secteur }} </label>
    <InputGeneric
      name="secteur"
      label="secteur"
      type="text"
      title="secteur"
      value=""
      :is-required="true"
      v-model="modelRef.secteur"
    />
  </div>
</template>

<script setup lang="ts">
import InputGeneric from '@/components/common/form/InputGeneric.vue';
import type { DevisEntreprise } from 'open-api-souscription-typescript';
import { ref } from 'vue';

export interface IProps {
  data?: DevisEntreprise;
}

const props = withDefaults(defineProps<IProps>(), {
  data: () => ({}),
  takingStatusIntoAccount: false
});

const modelRef = ref<DevisEntreprise>(props.data);
</script>
