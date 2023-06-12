import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useContractStepperStore = defineStore('contractStepperStore', () => {
  const state = ref<boolean>(false);

  const isContractStepper = computed(() => {
    return state.value;
  });

  function setContractStepper(contractStepper: boolean): void {
    state.value = contractStepper;
  }

  return {
    isContractStepper,
    setContractStepper
  };
});
