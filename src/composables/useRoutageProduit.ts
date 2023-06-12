import type { IQueryRoutage } from '@/models/IQueryRoutage';
import useConstante from '@/composables/useConstante';

export default () => {
  const { PARTICULIER, PROFESSIONEL, AGRICOLE, ASL, ASSOCIATION, PNO, COPRO } = useConstante();
  const onRouteToCorrectTemplate = (
    typeRisque: string,
    produitId: number,
    query: IQueryRoutage,
    update?: boolean,
    stepParam?: string
  ) => {
    let routeToGo = {};
    const param = { product: produitId, update: update ? 'true' : '', step: stepParam ?? '' };
    switch (typeRisque) {
      case PROFESSIONEL:
        routeToGo = {
          name: 'TemplateProfessional',
          params: param,
          query: query
        };
        break;
      case PARTICULIER:
        routeToGo = {
          name: 'TemplateParticular',
          params: param,
          query: query
        };
        break;
      case ASSOCIATION:
        routeToGo = {
          name: 'TemplateAssociation',
          params: param,
          query: query
        };
        break;
      case AGRICOLE:
        routeToGo = {
          name: 'TemplateAgricultural',
          params: param,
          query: query
        };
        break;
      case ASL:
        routeToGo = {
          name: 'TemplateASL',
          params: param,
          query: query
        };
        break;
      case PNO:
        routeToGo = {
          name: 'TemplatePNO',
          params: param,
          query: query
        };
        break;
      case COPRO:
        routeToGo = {
          name: 'TemplateCopro',
          params: param,
          query: query
        };
        break;
      default:
        routeToGo = {
          name: 'TemplateProfessional',
          params: param,
          query: query
        };
    }
    return routeToGo;
  };
  return { onRouteToCorrectTemplate };
};
