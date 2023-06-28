<template>
  <v-row class="px-5 my-0">
    <v-col cols="12">
      <h2 class="d-flex justify-center">
        {{ $tc('forms.popupEtude.refuse') }}
      </h2>
      <MessageCard @editMessage="editMessage($event)" />
    </v-col>
    <v-col cols="12" class="d-flex justify-content-flex-start flex-wrap">
      <v-btn class="px-5" color="error mr-6" @click="returnMenu()">
        {{ $tc('forms.buttons.cancel') }}
      </v-btn>
      <v-btn class="px-5" color="primary" @click="submitRefuse()">
        {{ $tc('forms.buttons.valid') }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import MessageCard from '@/components/devis/forms/dialogDevisEtude/MessageCard.vue';
import { ref } from 'vue';

const messageRef = ref('');

const emit = defineEmits(['returnMenu', 'submitRefuse']);

const returnMenu = () => {
  emit('returnMenu');
};

const submitRefuse = () => {
  emit('submitRefuse', { message: messageRef.value });
};

const editMessage = (message: string) => {
  messageRef.value = message;
};
</script>
