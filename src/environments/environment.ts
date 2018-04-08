// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBq7A6qe-yPAfs51wswNlMPna2vO8ZrMs8',
    authDomain: 'dodz-filmes.firebaseapp.com',
    databaseURL: 'https://dodz-filmes.firebaseio.com',
    projectId: 'dodz-filmes',
    storageBucket: 'dodz-filmes.appspot.com',
    messagingSenderId: '959726805696'
  }
};
