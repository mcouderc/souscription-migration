<template>
  <div class="justify-space-between d-flex pa-0 capitalize">
    <v-btn v-if="$slots['Cancel']" class="px-5" color="error" @click="cancelResponse()">
      <slot name="Cancel" />
    </v-btn>
    <v-spacer v-else />
    <v-btn
      v-if="$slots['Submit']"
      :disabled="props.isDisabled"
      color="primary"
      class="px-5"
      @click="submitResponse()"
    >
      <slot name="Submit" />
    </v-btn>
  </div>
</template>

<script setup lang="ts">
export interface IProps {
  isDisabled?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  isDisabled: false
});

const emit = defineEmits(['cancelResponse', 'submitResponse']);

const cancelResponse = () => {
  emit('cancelResponse', true);
};

const submitResponse = () => {
  emit('submitResponse', true);
};
</script>
