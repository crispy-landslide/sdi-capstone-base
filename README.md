# TROJN


## Overview
TROJN is a web application that streamlines the creation, development, and execution of cyber defense exercises known as Cyber Table Tops (CTTs) along with attack simulations for better coverage of system vulnerabilities.

## Table of Contents
[Description](#Description)

[Usage](#Usage)

[Environment Requirements](#Environment-Requirements)

[Team Members](#Team-Members)

[Dependencies](#Dependencies)
- [Frontend](#Frontend)
- [Backend](#Backend)


## Description
TROJN allows users to initiate attack and counter-offensive measures to gauge the level of vulnerabilities in a certain system via a Cyber Table Top (CTT) execution blueprint. A CTT is a thought exercise where the Red Team attacks vulnerabilities in the system and the Blue team determines whether the attacks are valid, the impact of the attacks on the mission, and the likelihood the attacks will succeed. Attacks are given a risk level of low, medium, or high to inform both leadership and the development team in their decision-making processes.

TROJN facilitates the planning of CTT events by allowing users to fill out teams and create attacks. Before the event, the Red Team can create the attacks that will be discussed during the event. During event execution, the Red Team and Blue team will go through each attack and determine its risk level.

The final output of an event is a report containing the risk matrix of all attacks to give leadership a quick glance of how vulnerable the system is.

TROJN also allows users to view the results from previous events, making it easy to follow the development of a system and whether risks were mitigated.

## Link to Project
[trojn.e-acres.com](https://trojn.e-acres.com)

## Features
The following are a list of features provided by the application:
- Account creation and login

- Office creation and management
  - Offices are groups of users that take ownership of their own user created events

- Events:
  - CTT events owned by user created offices which contain lists of teams, attacks, and reports

- Teams:
  - List of all teams and their users within each CTT event

- Missions:
  - Set of particular attacks within an event

- Attacks:
  - All attacks organized by user created missions

- Reports:
  -  Generate and display a risk matrix of all attacks within an event

## Environment Requirements
Node version 14 or higher is required
Docker version 20 or higher is required
Environment Variables :
- UI
  - `REACT_APP_SERVER_URL` -- URL of the API server
  - `REACT_APP_AUTH_URL` -- URL of the Keycloak server
  - `REACT_APP_KEYCLOAK_REALM` -- Name of the Keycloak realm
  - `REACT_APP_KEYCLOAK_CLIENT` -- Name of the Keycloak client for the frontend

- API
  - `NODE_ENV` -- should be `development` or `production`
  - `AUTH_URL` -- URL of the Keycloak server
  - `KEYCLOAK_CLIENT_ID` -- Name of the Keycloak client for the API
  - `KEYCLOAK_SECRET` -- A fairly long secret
  - `REALM_PUBLIC_KEY` -- Public key for the Keycloak realm
  - `DATABASE_HOST` -- Name of Docker container for the database
  - `POSTGRES_USER` -- Name of the database user
  - `POSTGRES_PASSWORD` -- Database password
  - `POSTGRES_PORT` -- Port number of database
  - `POSTGRES_DB` -- Name of the database

- Database
  - `DATABASE_HOST` -- Name of the docker container for the database
  - `POSTGRES_USER` -- Database user
  - `POSTGRES_PASSWORD` -- Database password
  - `POSTGRES_PORT` -- Database port number
  - `POSTGRES_DB` -- Name of the database

## Team Members

- [@crispy-landslide](https://github.com/crispy-landslide)
- [@devonknudsen](https://github.com/devonknudsen)
- [@mrichburg](https://github.com/mrichburg)
- [@UvZoomE](https://github.com/UvZoomE)


## Dependencies
'npm install' to install dependencies

### Frontend
- Astrouxds/react: ^6.6.0,
- React-keycloak/web: ^3.4.0,
- Keycloak-js: ^18.0.0,
- React: ^17.0.2,
- React-router-dom: ^6.3.0

- devDependencies:
  - @faker-js/faker: ^6.3.1,
  - @testing-library/jest-dom: ^5.16.4,
  - eslint: ^8.13.0,
  - eslint-plugin-jest: ^26.1.4,
  - eslint-plugin-react: ^7.29.4

### Backend
- cors: ^2.8.5,
- express: ^4.17.3,
- express-session: ^1.17.2,
- keycloak-connect: ^18.0.0,
- knex: ^1.0.4,
- morgan: ^1.10.0,
- pg: ^8.7.3

- devDependencies:
  - @faker-js/faker: ^6.3.1,
  - eslint: ^8.13.0,
  - eslint-plugin-jest: ^26.1.4,
  - jest: ^27.5.1,
  - nodemon: ^2.0.15



