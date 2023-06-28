<template>
  <v-col>
    <v-row class="pb-2">
      <v-col cols="6">
        <label> {{ modelRef.nombreVehicules }} </label>
        <InputGeneric
          name="numberVehicles"
          input-type="number"
          :title="$tc('page.additionalInformation.numberVehicles')"
          value=""
          :is-required="true"
          v-model="modelRef.nombreVehicules"
        />
      </v-col>
      <v-col cols="6">
        <label> {{ modelRef.nombreResidencesSecondaires }} </label>
        <InputGeneric
          name="nombreResidencesSecondaires"
          v-model="modelRef.nombreResidencesSecondaires"
          value=""
          input-type="number"
          input-id="nombreResidencesSecondaires"
          :title="$tc('page.additionalInformation.numberResidenceSecondaire')"
          :is-required="true"
        />
      </v-col>
    </v-row>
  </v-col>
</template>

<script setup lang="ts">
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
</script>
<style scoped>
.col {
  padding-bottom: 0px;
}
</style>
