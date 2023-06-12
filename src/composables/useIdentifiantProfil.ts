import { computed } from 'vue';
import { useIdentifiantProfilStore } from '@/stores/identifiantProfilStore';
import type IPapperEntreprise from '@/models/IPapperEntreprise';

export default function () {
  const identifiantProfilStore = useIdentifiantProfilStore();
  const identifiantProfil = computed(() => identifiantProfilStore.identifiantProfil);

  const setIdentifiantProfil = (identificationProfil: IPapperEntreprise) => {
    identifiantProfilStore.setIdentifiantProfil(identificationProfil);
  };

  return {
    identifiantProfil,
    setIdentifiantProfil
  };
}
