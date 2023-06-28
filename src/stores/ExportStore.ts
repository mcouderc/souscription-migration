import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
interface IExportPathState {
  exportPath: string;
}
export const useExportPathStore = defineStore('exportStore', () => {
  const state = ref<IExportPathState>({ exportPath: '' });

  const exportPath = computed<string>(() => {
    return state.value.exportPath;
  });

  const setExportPath = (exportPath: string) => {
    state.value.exportPath = exportPath;
  };

  return {
    exportPath,
    setExportPath
  };
});
