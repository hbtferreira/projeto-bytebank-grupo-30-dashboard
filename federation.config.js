const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({

  name: 'projeto-bytebank-grupo-30-dashboard',

  exposes: {
    './Component': './src/app/app.component.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
    // Impedir que secundários de @angular/common (ex.: locales) sejam externalizados,
    // para que sejam empacotados neste remoto e não resolvidos via import map em runtime
    '@angular/common': { singleton: true, strictVersion: true, requiredVersion: 'auto', includeSecondaries: false },
  },

  // Não compartilhe mapeamentos de locales para evitar erro de resolução em runtime
  // Deixe vazio para que os locales sejam empacotados dentro do remoto
  sharedMappings: [],

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
    // Add further packages you don't need at runtime
  ],

  // Please read our FAQ about sharing libs:
  // https://shorturl.at/jmzH0

  features: {
    // New feature for more performance and avoiding
    // issues with node libs. Comment this out to
    // get the traditional behavior:
    ignoreUnusedDeps: true
  }

});
