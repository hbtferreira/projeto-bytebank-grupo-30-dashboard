/*
export const environment = {
  production: false,
  useLocalDb: true,
  apiBaseUrl: 'http://localhost:3003',
  apiVersion: '/v1',
  apiNamespace: '/bytebank',
  shell: {
    remoteEntry: 'http://localhost:4200/remoteEntry.js',
    remoteName: 'shell-projeto-bytebank-gp-30'
  }
};
*/
export const environment = {
  production: true,
  useLocalDb: false,
  apiBaseUrl: 'https://bybank-back-end.onrender.com',
  apiVersion: '/v1',
  apiNamespace: '/bytebank',
  shell: {
    remoteEntry: 'https://shell-projeto-bytebank-gp-30.vercel.app/remoteEntry.js',
    remoteName: 'shell-projeto-bytebank-gp-30'
  }
};
