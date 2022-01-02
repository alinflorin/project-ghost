// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  defaultLanguage: 'en',
  availableLanguages: [
    {
      label: 'English',
      code: 'en'
    },
    {
      label: 'Română',
      code: 'ro'
    }
  ],
  hb: 10000,
  firebase: {
    apiKey: "AIzaSyBBlm1FykI_UPgn3LVuPSiIgRMfkh8Nh3c",
    authDomain: "project-ghost-af.firebaseapp.com",
    projectId: "project-ghost-af",
    storageBucket: "project-ghost-af.appspot.com",
    messagingSenderId: "283388547683",
    appId: "1:283388547683:web:d52c2cda853cbe5299de56",
    measurementId: "G-L83XKSY1TJ"
  },
  toastDuration: 5000,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
