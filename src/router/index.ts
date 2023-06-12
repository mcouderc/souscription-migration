import type { RouteLocationNormalized } from 'vue-router';

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import PageError from '@/views/pages/PageError.vue';
import PageNotAuthorized from '@/views/pages/PageNotAuthorizedView.vue';
import PageNotFound from '@/views/pages/PageNotFoundView.vue';
import useIasAndRole from '@/composables/authenticate/useIasAndRole';
import usePermission from '@/composables/authenticate/usePermission';
import usePermissionMatrix from '@/composables/authenticate/usePermissionMatrix';
import TemplateParticular from '@/views/markets/TemplateParticular.vue';

/* Subscription page */
import IndexView from '@/views/pages/app-view/IndexView.vue';
import HomeView from '@/views/pages/app-view/components/HomeView.vue';
import SubscriptionProduits from '@/views/pages/app-view/components/ProductsView.vue';
/* End Subscription page */

import { ProduitTypeRisqueEnum } from 'open-api-souscription-typescript';

const { permissionMatrix } = usePermissionMatrix();

const projectroutes = [
  {
    path: '/',
    meta: {
      title: 'navigation.subscription'
    },
    component: IndexView,
    children: [
      {
        name: 'subscription',
        path: '/',
        component: HomeView,
        meta: {
          isAuthorizationRequired: true,
          roles: permissionMatrix.allRolesButConsultation
        }
      },
      {
        path: '/produits/:market',
        name: 'SouscriptionMarket',
        component: SubscriptionProduits,
        meta: {
          breadCrumb(route: RouteLocationNormalized) {
            return [
              {
                text: 'accueil',
                to: { path: '/' }
              },
              {
                text: 'produits',
                to: { path: '/produits' }
              },
              {
                text: route.params.market
              }
            ];
          },
          isAuthorizationRequired: true,
          roles: permissionMatrix.allRolesButConsultation
        }
      },
      {
        path: '/produits/:market/:product',
        name: 'SouscriptionMarketProduct',
        component: SubscriptionProduits,
        meta: {
          breadCrumb(route: RouteLocationNormalized) {
            return [
              {
                text: 'accueil',
                to: { path: '/' }
              },
              {
                text: 'produits',
                to: { path: '/produits' }
              },
              {
                text: getRouteMarket(String(route.params.market)),
                to: { path: `/produits/${route.params.market}` }
              }
            ];
          },
          isAuthorizationRequired: true,
          roles: permissionMatrix.allRolesButConsultation
        }
      },
      {
        path: '/produits/',
        component: SubscriptionProduits,
        meta: {
          breadCrumb() {
            return [
              {
                text: 'accueil',
                to: { path: '/' }
              },
              {
                text: 'produits'
              }
            ];
          },
          isAuthorizationRequired: true,
          roles: permissionMatrix.allRoles
        }
      },
      {
        path: '/devis/particulier/:product/',
        name: 'TemplateParticular',
        meta: {
          title: 'navigation.page',
          isAuthorizationRequired: true,
          roles: permissionMatrix.allRoles
        },
        component: TemplateParticular
      }
    ]
  },
  {
    path: '/error',
    name: 'PageError',
    meta: {
      title: 'navigation.PageError'
    },
    component: PageError
  },
  {
    path: '/403-access-denied',
    name: 'PageNotAuthorized',
    meta: {
      title: 'navigation.PageNotAuthorized'
    },
    component: PageNotAuthorized
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'PageNotFound',
    meta: {
      title: 'navigation.pageNotFound'
    },
    component: PageNotFound
  }
] as RouteRecordRaw[];

const router = createRouter({
  routes: projectroutes,
  history: createWebHistory(import.meta.env.BASE_URL)
});

const getRouteMarket = (market: string) => {
  return market === ProduitTypeRisqueEnum.ProfessionnelEntreprise ? 'Professionnel' : market ?? '';
};

router.beforeEach(async (to, from, next) => {
  const { isAuthorizationRequired, roles } = to.meta;
  const { roleStore, hydrateIasCodesAndRole } = useIasAndRole();
  // const { doesHavePermission } = usePermission();
  if (!isAuthorizationRequired) {
    next();
  } else {
    if (!roleStore.value) {
      try {
        await hydrateIasCodesAndRole();
        if (!roleStore.value) {
          throw new Error('liste des roles non disponible');
        }
      } catch (e) {
        next({ name: 'PageError' });
      }
    }
    // const isUserAllowed = doesHavePermission(roles ?? []);
    // Vue3
    const isUserAllowed = true;
    if (isUserAllowed) {
      next();
    } else {
      next({ name: 'PageNotAuthorized' });
    }
  }
});

export default router;
