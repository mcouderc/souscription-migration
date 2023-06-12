import { createApp } from 'vue';
import { createPinia } from 'pinia';
import axios from 'axios';
import VueAxios from 'vue-axios';
import 'vuetify/styles';
// import { createVuetify } from 'vuetify';
// import * as components from 'vuetify/components';
// import * as directives from 'vuetify/directives';
import { createI18n } from 'vue-i18n';
import fr from '@/locales/fr.json';
import App from './App.vue';
import router from './router';
import vuetify from '@/plugins/vuetify';

import './assets/main.css';

// Vee-validate global rules
import { defineRule } from 'vee-validate';
defineRule('required', (value) => {
  if (!value || !value.length) {
    return 'This field is required';
  }
  return true;
});
defineRule('email', (value) => {
  // Field is empty, should pass
  if (!value || !value.length) {
    return true;
  }
  // Check if email
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  if (!regex.test(value)) {
    return 'This field must be a valid email';
  }
  return true;
});
defineRule('minLength', (value, [limit]) => {
  // The field is empty so it should pass
  if (!value || !value.length) {
    return true;
  }
  if (value.length < limit) {
    return `This field must be at least ${limit} characters`;
  }
  return true;
});

const app = createApp(App);
const pinia = createPinia();

const i18n = createI18n({
  // something vue-i18n options here ...
  locale: 'fr',
  allowComposition: true,
  fallbackLocale: 'fr',
  messages: { fr }
});

// const vuetify = createVuetify({
//   components,
//   directives
// });

app.use(router);
app.use(VueAxios, axios);
app.use(pinia);
app.use(vuetify);
app.use(i18n);
app.mount('#app');
