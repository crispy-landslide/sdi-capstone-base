import '@astrouxds/astro-web-components/dist/astro-web-components/astro-web-components.css'
import './App.css'
import React, { useEffect, useState, createContext } from 'react';
import config from './config'
import {Routes, Route} from 'react-router-dom'
import Header from './components/Header';
import Welcome from './pages/Welcome'
import Event from './pages/Event'
import Teams from './pages/Teams'
import Tasks from './pages/Tasks'
import Attacks from './pages/Attacks'
import Report from './pages/Report'
import EventSettings from './pages/EventSettings'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import { makeTestEvents, makeTestUsers, makeTestAttacks, makeTestTeams } from './generateTestData'
import keycloak from './keycloak'


const initOptions = {
  onLoad: 'check-sso',
  checkLoginIframe: false,
}

// const ApiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;

export const StateContext = createContext(null);

function App() {
  const [user, setUser] = useState()
  const [events, setEvents] = useState(makeTestEvents(10))
  const [users, setUsers] = useState(makeTestUsers(10))
  const [attacks, setAttacks] = useState(makeTestAttacks(30))
  const [teams, setTeams] = useState(makeTestTeams(10))
  const [serverURL, setServerURL] = useState(process.env.REACT_APP_SERVER_URL || 'http://localhost:3001')
  const [currentEvent, setCurrentEvent] = useState();
  const [currentAttack, setCurrentAttack] = useState();

  const stateContextValues = {
    events, setEvents,
    users, setUsers,
    attacks, setAttacks,
    teams, setTeams,
    currentEvent, setCurrentEvent,
    currentAttack, setCurrentAttack
  }

  const eventHandler = async (event, error) => {
    if (event === 'onReady') {
      console.log("Ready")
    }
    if (event === 'onAuthSuccess') {
      const request = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${keycloak.token}`
        }
      }

      let user = await fetch(`${serverURL}/api/users/`, request)
              .then(async response => {
                  if (response.status === 201) {
                    return await response.json()
                  }
              })
              .catch(err => console.log(err))

      if (user === undefined) {
        user = await fetch(`${serverURL}/api/users/my-account`, {...request, method: 'GET'})
          .then(response => response.json())
          .then(data => data)
          .catch(err => console.log(err))
      }
      console.log(user)
      setUser(user)
    }
  }

  useEffect(() => {
    let path = window.location.pathname
    let id = Number.parseInt(path.split('/events/')[1])
    if (id) {
      setCurrentEvent(events.find(event => event.id === id))
    }
  }, []);


  return (
    <ReactKeycloakProvider authClient={keycloak} initOptions={initOptions} onEvent={eventHandler}>
      <div className='app'>
        <StateContext.Provider value={stateContextValues}>
          <Header />
          <div className='main-page' id='main-page'>
            <Routes>
              <Route path='/' element={<Welcome />} />
              <Route path='/events/:id' element={<Event />} />
              <Route path='/events/:id/teams' element={<Teams />} />
              <Route path='/events/:id/tasks' element={<Tasks />} />
              <Route path='/events/:id/attacks' element={<Attacks />} />
              <Route path='/events/:id/report' element={<Report />} />
              <Route path='/events/:id/settings' element={<EventSettings />} />
            </Routes>
          </div>

        </StateContext.Provider>
      </div>
    </ReactKeycloakProvider>

  );
}

export default App;
