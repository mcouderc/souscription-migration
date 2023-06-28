<template>
  <div>
    <p v-for="(error, index) in errorRef" :key="index" class="sub-error">
      {{ error }}
    </p>
    <p class="sub-error">
      {{ etudeMessageRef }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { IErrorEligibilite } from '@/models/form_validate/interface/IErrorEligibilite';
import { InformationEligibiliteActionEnum } from 'open-api-souscription-typescript';
import { onMounted, ref, watch } from 'vue';
import useDevis from '@/composables/useDevis';

export interface IProps {
  errors: IErrorEligibilite[];
  conditionSpec: string;
}

const props = withDefaults(defineProps<IProps>(), {
  conditionSpec: ''
});

const { devis } = useDevis();

const errorRef = ref<string[]>([]);
const etudeMessageRef = ref<string>(props.conditionSpec);

onMounted(() => {
  errorRef.value = [];
  props.errors.map((error) => {
    if (error.action === InformationEligibiliteActionEnum.Alerte) {
      errorRef.value.push(error.message);
    }
  });
});

watch(
  () => devis.value?.conditionsSpecifiques,
  () => {
    etudeMessageRef.value = devis.value?.conditionsSpecifiques;
  },
  { deep: true }
);
</script>
<style>
.sub-error {
  color: red;
  padding-left: 13px;
  margin-bottom: 0px !important;
}
</style>
