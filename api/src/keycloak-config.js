const session = require('express-session');
const Keycloak = require('keycloak-connect');

let keycloak;

const keycloakConfig = {
  "realm": "showcase-auth",
  "bearer-only": true,
  "auth-server-url": process.env.AUTH_URL,
  "ssl-required": "external",
  "resource": process.env.KEYCLOAK_CLIENT_ID,
  "confidential-port": 0,
  "realmPublicKey": process.env.REALM_PUBLIC_KEY
}

const initKeycloak = () => {
  if (keycloak) {
    console.log("Return existing keycloak instance.");
    return keycloak;
  } else {
    console.log("Initialize new keycloak instance.");
    let memoryStore = new session.MemoryStore();
    keycloak = new Keycloak({
      store: memoryStore,
      secret: process.env.KEYCLOAK_SECRET,
      resave: false,
      saveUninitialized: true
    }, keycloakConfig);
    return keycloak;
  }
}

module.exports = initKeycloak;