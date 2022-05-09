import Keycloak from 'keycloak-js'

// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const options = {
  "realm": process.env.REACT_APP_KEYCLOAK_REALM || "showcase-auth",
  "url": process.env.REACT_APP_AUTH_URL || "http://localhost:8080",
  "clientId": process.env.REACT_APP_KEYCLOAK_CLIENT || "trojn-app"
}
const keycloak = new Keycloak(options)

export default keycloak