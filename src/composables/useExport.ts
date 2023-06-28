import { useExportPathStore } from '@/stores/ExportStore';
import { computed } from 'vue';
import axiosInstance from '@/axiosHelper';

export default () => {
  const exportStore = useExportPathStore();
  const setExportPath = (path: string) => {
    exportStore.setExportPath(path);
  };

  const exportPath = computed<string>(() => exportStore.exportPath);

  const downloadFile = (route: string) => {
    axiosInstance()
      .get(route, {
        responseType: 'blob'
      })
      .then((fileData) => {
        const todayDate = new Date().toISOString().slice(0, 10).split('-').join('');
        forceFileDownload(fileData, `export_${todayDate}.xlsx`);
      });
  };

  const forceFileDownload = (response, title) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', title);
    document.body.appendChild(link);
    link.click();
  };

  return {
    exportPath,
    setExportPath,
    downloadFile
  };
};
