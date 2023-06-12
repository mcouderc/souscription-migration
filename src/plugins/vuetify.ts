import { createVuetify, type ThemeDefinition } from 'vuetify';
import * as components from 'vuetify/components';
import * as labsComponents from 'vuetify/labs/components';
import * as directives from 'vuetify/directives';

const light: ThemeDefinition = {
  dark: false,
  colors: {
    'bg-default': '#edf2f6',
    'grey-darken-1': '#757575',
    primary: '#00446B',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#E53442',
    info: '#2196F3',
    success: '#95B74C',
    warning: '#E1741D'
  }
};

const dark: ThemeDefinition = {
  dark: true,
  colors: {
    'bg-default': '#F3F3F4',
    'grey-darken-1': '#757575',
    primary: '#18A689',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#E53935',
    info: '#2196F3',
    success: '#43A047',
    warning: '#FB8C00'
  }
};

export default createVuetify({
  components: {
    ...components,
    ...directives,
    ...labsComponents
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light,
      dark
    }
  }
});
