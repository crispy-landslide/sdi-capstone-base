Create a project-wide README.md
Include the following:
    Title of project
    Links to team projects (if applicable)
    Example usage, like a URL a user could visit in order to see output for your site
    Environment requirements, like making sure the developer is using a certain Node version
    Development code, if it exists
    Installing dependencies, like npm install --production, etc.


# TROJN


# Overview
TROJN is a web application that streamlines the creation, development, and execution of cyber defense exercises known as Cyber Table Tops (CTTs) along with attack simulations for better coverage of system vulnerabilities.

# Table of Contents
[Description](#Description)

[Usage](#Usage)

[Environment Requirements](#Environment-Requirements)

[Team Members](#Team-Members)

[Dependencies](#Dependencies)
- [Frontend](#Frontend)
- [Backend](#Backend)


# Description
TROJN allows users to initiate attack and counter-offensive measures to gauge the level of vulnerabilities in a certain system via a Cyber Table Top (CTT) execution blueprint. A CTT is a thought exercise where the Red Team attacks vulnerabilities in the system and the Blue team determines whether the attacks are valid, the impact of the attacks on the mission, and the likelihood the attacks will succeed. Attacks are given a risk level of low, medium, or high to inform both leadership and the development team in their decision-making processes.

TROJN facilitates the planning of CTT events by allowing users to fill out teams and create attacks. Before the event, the Red Team can create the attacks that will be discussed during the event. During event execution, the Red Team and Blue team will go through each attack and determine its risk level.

The final output of an event is a report containing the risk matrix of all attacks to give leadership a quick glance of how vulnerable the system is.

TROJN also allows users to view the results from previous events, making it easy to follow the development of a system and whether risks were mitigated.

# Usage


# Environment Requirements
Node version 14 or higher is required
Docker version 20 or higher is required
Docker-compose :
 - UI
      - REACT_APP_SERVER_URL= ''
      - REACT_APP_AUTH_URL= ''
      - REACT_APP_KEYCLOAK_REALM= ''
      - REACT_APP_KEYCLOAK_CLIENT= ''

- API
      - NODE_ENV= ''
      - AUTH_URL= ''
      - KEYCLOAK_CLIENT_ID= ''
      - KEYCLOAK_SECRET= ''
      - REALM_PUBLIC_KEY= ''
      - DATABASE_HOST= ''
      - POSTGRES_USER= ''
      - POSTGRES_PASSWORD= ''
      - POSTGRES_PORT= ''
      - POSTGRES_DB= ''
- Database
     - DATABASE_HOST= ''
     - POSTGRES_USER= ''
     - POSTGRES_PASSWORD= ''
     - POSTGRES_PORT= ''
     - POSTGRES_DB= ''

# Team Members

- [@crispy-landslide](https://github.com/crispy-landslide)
- [@devonknudsen](https://github.com/UvZoomE)
- [@mrichburg](https://github.com/mrichburg)
- [@UvZoomE](https://github.com/UvZoomE)


# Dependencies
## Frontend
    Astrouxds/react: ^6.6.0,
npm i @astrouxds/astro-web-components
    React-keycloak/web: ^3.4.0,
npm i --save @react-keycloak/web
    Axios: ^0.26.1,
npm i axios
    Keycloak-js: ^18.0.0,
    React: ^17.0.2,
npx create-react-app

  devDependencies:
    @faker-js/faker: ^6.3.1,
npm i @faker-js/faker –save-dev
    @testing-library/jest-dom: ^5.16.4,
    eslint: ^8.13.0,
npm i eslint
    eslint-plugin-jest: ^26.1.4,
    eslint-plugin-react: ^7.29.4

## Backend
    cors: ^2.8.5,
npm i cors
    express: ^4.17.3,
npm i express
    express-session: ^1.17.2,
npm i express-session
    keycloak-connect: ^18.0.0,
npm i keycloak-connect
    knex: ^1.0.4,
npm i knex
    morgan: ^1.10.0,
npm i morgan
    pg: ^8.7.3
npm i pg

  devDependencies: {
    @faker-js/faker: ^6.3.1,
npm i @faker-js/faker –save-dev
    eslint: ^8.13.0,
npm i eslint
    eslint-plugin-jest: ^26.1.4,
yarn add --dev eslint eslint-plugin-jest
    jest: ^27.5.1,
npm i jest
    nodemon: ^2.0.15
npm i nodemon
  }


