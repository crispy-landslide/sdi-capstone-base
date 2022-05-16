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
import AddOffice from './pages/AddOffice'
import EventSettings from './pages/EventSettings'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import keycloak from './keycloak'


const initOptions = {
  onLoad: 'login-required'
}

// const ApiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;

export const StateContext = createContext(null);

function App() {
  const [user, setUser] = useState()
  const [events, setEvents] = useState()

  const [users, setUsers] = useState()
  const [currentOffice, setCurrentOffice] = useState()
  const [tasks, setTasks] = useState()
  const [attacks, setAttacks] = useState()
  const [teams, setTeams] = useState()
  const [missions, setMissions] = useState()
  const [currentMission, setCurrentMission] = useState()
  const [currentEvent, setCurrentEvent] = useState();
  const [currentAttack, setCurrentAttack] = useState();

  const [serverURL, setServerURL] = useState(process.env.REACT_APP_SERVER_URL || 'http://localhost:3001')

  const fetchEvents = async (user) => {
    const request = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${keycloak.token}`
      }
    }
    let newEvents = []
    // await user.offices.forEach(async officeId => console.log(officeId))
    await user.offices.forEach(async office => await fetch(`${serverURL}/api/offices/${office.id}/events`, request)
      .then(response => response.json())
      .then(async data => {
        newEvents = [...newEvents, ...data]
        await setEvents(newEvents.filter(event => !event.is_deleted))
        // console.log(events)
      })
      .catch(err => console.log(err)))
  }

  const fetchUserInfo = async () => {
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
          } else {
            console.log(response.status)
          }
      })
      .catch(err => console.log(err))

    if (user === undefined) {
      user = await fetch(`${serverURL}/api/users/my-account`, {...request, method: 'GET'})
        .then(response => response.json())
        .then(data => data)
        .catch(err => console.log(err))
    }
    setUser(user)
    return user;
  }

  const stateContextValues = {
    events, setEvents,
    user, setUser,
    currentOffice, setCurrentOffice,
    users, setUsers,
    tasks, setTasks,
    attacks, setAttacks,
    teams, setTeams,
    missions, setMissions,
    currentMission, setCurrentMission,
    currentEvent, setCurrentEvent,
    currentAttack, setCurrentAttack,
    fetchUserInfo, fetchEvents,
    serverURL
  }

  const eventHandler = async (event, error) => {
    if (event === 'onReady') {
      console.log("Ready")
    }
    if (event === 'onAuthSuccess') {
      let user = await fetchUserInfo()
      user.offices && setCurrentOffice(user.offices[0])
      await fetchEvents(user)
    }
  }

  const refresh = async (office_id, event_id) => {
    let user = await fetchUserInfo()
    setCurrentOffice(user.offices.filter(office => office.id === office_id))
    let events = await fetchEvents(user)
    setCurrentEvent(events?.find(event => event.id === event_id))
  }

  useEffect(() => {
    let path = window.location.pathname
    let office_id = Number.parseInt(path.split('/')[2])
    let event_id = Number.parseInt(path.split('/')[4])
    console.log(event_id, office_id)
    if (event_id && office_id && keycloak.authenticated) {
      refresh(office_id, event_id)
    }
  }, [keycloak.authenticated]);


  return (
    <ReactKeycloakProvider authClient={keycloak} initOptions={initOptions} onEvent={eventHandler}>
      <div className='app'>
        <StateContext.Provider value={stateContextValues}>
          <Header />
          <div className='main-page' id='main-page'>
            <Routes>
              {user ? <Route path='/' element={user.offices?.length > 0 ? <Welcome /> : <AddOffice />} /> : ''
              }
              <Route path='/offices/:office_id/events/:event_id' element={<Event />} />
              <Route path='/offices/:office_id/events/:event_id/teams' element={<Teams />} />
              <Route path='/offices/:office_id/events/:event_id/tasks' element={<Tasks />} />
              <Route path='/offices/:office_id/events/:event_id/attacks' element={<Attacks />} />
              <Route path='/offices/:office_id/events/:event_id/report' element={<Report />} />
              <Route path='/offices/:office_id/events/:event_id/settings' element={<EventSettings />} />
            </Routes>
          </div>

        </StateContext.Provider>
      </div>
    </ReactKeycloakProvider>

  );
}

export default App;
