import useConstante from '@/composables/useConstante';

export default function validationRulesCityCode() {
  const { REGEX, COUNTRYS } = useConstante();

  const controlCityCodeByCountry = (country: string): string => {
    switch (country) {
      case COUNTRYS.AD: {
        return REGEX.CODE_POSTAL.AD;
      }
      case COUNTRYS.LX: {
        return REGEX.CODE_POSTAL.LX;
      }
      case COUNTRYS.MC: {
        return REGEX.CODE_POSTAL.MC;
      }
      case COUNTRYS.BE: {
        return REGEX.CODE_POSTAL.BE;
      }
      case COUNTRYS.FR: {
        return REGEX.CODE_POSTAL.FR;
      }
      default: {
        break;
      }
    }
  };

  return {
    controlCityCodeByCountry
  };
}
