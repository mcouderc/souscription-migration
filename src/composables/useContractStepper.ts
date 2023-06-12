import { computed } from 'vue';
import { useContractStepperStore } from '@/stores/contractStepperStore';

export default function () {
  const contractStepperStore = useContractStepperStore();
  const isContractStepper = computed(() => contractStepperStore.isContractStepper);
  const setContractStepper = (contractStepper: boolean) => {
    contractStepperStore.setContractStepper(contractStepper);
  };

  return {
    isContractStepper,
    setContractStepper
  };
}
