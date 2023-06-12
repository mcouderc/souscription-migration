import type IRootNavigation from '@/models/IRootNavigation';

const rootNavigation: IRootNavigation[] = [
  {
    icon: 'mdi-lead-pencil',
    title: 'navigation.subscription',
    link: '/'
  },
  {
    icon: 'mdi-file-document',
    title: 'navigation.listDevis',
    link: '/devis-etablis'
  },
  {
    icon: 'mdi-file-sign',
    title: 'navigation.listSigning',
    link: '/liste-signatures'
  }
];

export default rootNavigation;
