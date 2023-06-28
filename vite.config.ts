import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    server: {
      proxy: {
        '^/api/espace-partenaire-souscription/': {
          target: env.VITE_PROXY_API_ESPACE_PARTENAIRE,
          ws: true,
          changeOrigin: true
        },
        '^/api/': {
          target: env.VITE_PROXY_API_TARGET,
          //rewrite: (path) => path.replace('/api/souscription/', ''),
          ws: true,
          changeOrigin: true
        }
      }
    },
    plugins: [
      vue({
        customElement: true
      }),
      vueJsx(),
      legacy({
        targets: ['ie >= 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime']
      })
    ],
    base: '/souscription/',

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
    // build: {
    //   /** If you set esmExternals to true, this plugins assumes that
    //     all external dependencies are ES modules */
    //   commonjsOptions: {
    //     esmExternals: true
    //   }
    // }
  };
});
