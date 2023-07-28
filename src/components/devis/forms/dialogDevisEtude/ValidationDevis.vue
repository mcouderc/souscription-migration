<template>
  <v-row class="px-5 my-0">
    <v-col cols="12">
      <h2 class="d-flex justify-center">
        {{ $tc('forms.popupEtude.validation') }}
      </h2>
      <p class="mt-4">
        {{ $tc('forms.popupEtude.primeTTCavant') }}
        {{ devis.primeTtcAvantVariation ? devis.primeTtcAvantVariation : devis.primeTtc }} €
        <br />
        {{ $tc('forms.popupEtude.primeTTCapres') }}
        {{ devis.primeTtc }} €
      </p>
      <v-btn class="px-5 button_return_prime" color="light" @click="closePopup()">
        {{ $tc('forms.popupEtude.buttonPrimeReturn') }}
      </v-btn>
      <MessageCard @editMessage="editMessage($event)" />
      <ConditionsSpecCard
        v-if="doesHavePermissionAmongAllRolesButBrokerAndConsultationAndDelegate()"
        @editConditionSpec="editConditionSpec($event)"
      />
    </v-col>
    <v-col cols="12" class="d-flex justify-content-flex-start flex-wrap">
      <v-btn class="px-5" color="error mr-6" @click="returnMenu()">
        {{ $tc('forms.buttons.cancel') }}
      </v-btn>
      <v-btn class="px-5" color="primary" @click="submitValidation()">
        {{ $tc('forms.buttons.valid') }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import MessageCard from '@/components/devis/forms/dialogDevisEtude/MessageCard.vue';
import usePermission from '@/composables/authenticate/usePermission';
import ConditionsSpecCard from '@/components/devis/forms/dialogDevisEtude/ConditionsSpecCard.vue';
import useDevis from '@/composables/useDevis';
import router from '@/router';
import { useRoute } from 'vue-router';
import { ref } from 'vue';

const { devis } = useDevis();
const { doesHavePermissionAmongAllRolesButBrokerAndConsultationAndDelegate } = usePermission();

const route = useRoute();

const messageRef = ref('');
const conditionSpecRef = ref('');

const emit = defineEmits(['returnMenu', 'submitValidation', 'closePopup']);

const returnMenu = () => {
  emit('returnMenu');
};

const submitValidation = () => {
  emit('submitValidation', { message: messageRef.value, conditionSpec: conditionSpecRef.value });
};

const editMessage = (message: string) => {
  messageRef.value = message;
};

const editConditionSpec = (conditionSpec: string) => {
  conditionSpecRef.value = conditionSpec;
};

const closePopup = () => {
  if (!route.query.id) {
    router.replace({ name: 'OverviewDevis', query: { id: devis.value.id.toString() } });
  } else {
    emit('closePopup');
  }
};
</script>
<style scoped>
.button_return_prime {
  height: 30px !important;
}
</style>
