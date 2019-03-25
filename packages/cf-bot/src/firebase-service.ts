import {
  confirmFirebaseConfigurationEnvVars,
  confirmLocalFirebaseConfigurationEnvVars,
  devAndTestingEnvironments,
  FIREBASE_CONFIGURATION_ENV_KEYS,
  FirebaseServiceFactory
} from "@counterfactual/node";

export function configureServiceFactory() {
  console.log(`Using Firebase configuration for ${process.env.NODE_ENV}`);

  if (!devAndTestingEnvironments.has(process.env.NODE_ENV!)) {
    confirmFirebaseConfigurationEnvVars();
    return new FirebaseServiceFactory({
      apiKey: process.env[FIREBASE_CONFIGURATION_ENV_KEYS.apiKey]!,
      authDomain: process.env[FIREBASE_CONFIGURATION_ENV_KEYS.authDomain]!,
      databaseURL: process.env[FIREBASE_CONFIGURATION_ENV_KEYS.databaseURL]!,
      projectId: process.env[FIREBASE_CONFIGURATION_ENV_KEYS.projectId]!,
      storageBucket: process.env[
        FIREBASE_CONFIGURATION_ENV_KEYS.storageBucket
      ]!,
      messagingSenderId: process.env[
        FIREBASE_CONFIGURATION_ENV_KEYS.messagingSenderId
      ]!
    });
  }

  confirmLocalFirebaseConfigurationEnvVars();
  const firebaseServerHost = process.env.FIREBASE_SERVER_HOST;
  const firebaseServerPort = process.env.FIREBASE_SERVER_PORT;
  return new FirebaseServiceFactory({
    apiKey: "",
    authDomain: "",
    databaseURL: `ws://${firebaseServerHost}:${firebaseServerPort}`,
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
  });
}
