import useConstante from '@/composables/useConstante';

export default function () {
  const { COUNTRYS } = useConstante();

  const getCountry = (codePays: string): string => {
    switch (codePays) {
      case 'FR':
        return 'France';
      case 'GP':
        return 'Guadeloupe';
      case 'GF':
        return 'Guyanne';
      case 'RE':
        return 'La Réunion';
      case 'MQ':
        return 'Martinique';
      case 'YT':
        return 'Mayotte';
      case 'BE':
        return 'Belgique';
      case 'MC':
        return 'Monaco';
      case 'AD':
        return 'Andorre';
      case 'LX':
        return 'Luxembourg';
      default:
        return codePays;
    }
  };

  const getCodePays = (pays: string): string => {
    switch (pays) {
      case 'FRANCE':
        return COUNTRYS.FR;
      case 'BELGIQUE':
        return COUNTRYS.BE;
      case 'MONACO':
        return COUNTRYS.MC;
      case 'ANDORRE':
        return COUNTRYS.AD;
      case 'LUXEMBOURG':
        return COUNTRYS.LX;
      default:
        return pays;
    }
  };

  return {
    getCountry,
    getCodePays
  };
}
