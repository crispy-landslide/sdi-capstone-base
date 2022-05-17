import React, { useEffect, useContext } from 'react'
import { StateContext } from '../App.js'
import { useKeycloak } from '@react-keycloak/web'
import './styles/Event.css'

const Event = () => {
  const state = useContext(StateContext)
  const { keycloak, initialized } = useKeycloak();

  const fetchTeams = async () => {
    const request = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${keycloak.token}`
      }
    }

    let teams = await fetch(`${state.serverURL}/api/offices/${state.currentOffice.id}/events/${state.currentEvent.id}/teams`, request)
      .then(response => response.json())
      .then(data => data)
      .catch(err => console.log(err))

    state.setTeams(teams)
    return teams
  }

  const fetchUsers = async (teams) => {
    const request = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${keycloak.token}`
      }
    }
    let users = [];
    for (const team of teams) {
      let team_users = await fetch(`${state.serverURL}/api/offices/${state.currentOffice.id}/events/${state.currentEvent.id}/teams/${team.id}/users`, request)
        .then(response => response.json())
        .then(data => data)
        .catch(err => console.log(err))

        users.push(team_users);
    }
    state.setUsers(users.flat())

  }

  const fetchMissions = async () => {
    const request = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${keycloak.token}`
      }
    }
    let missions = await fetch(`${state.serverURL}/api/offices/${state.currentOffice.id}/events/${state.currentEvent.id}/missions`, request)
      .then(response => response.json())
      .then(data => data)
      .catch(err => console.log(err))
    let newMissions = await missions.filter(mission => !mission.is_deleted).sort((a, b) => a.number - b.number)
    state.setMissions(newMissions)
    return newMissions
  }

  const fetchAttacks = async (missions) => {
    const request = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${keycloak.token}`
      }
    }

    let attacks = await fetch(`${state.serverURL}/api/offices/${state.currentOffice.id}/events/${state.currentEvent.id}/attacks`, request)
      .then(response => response.json())
      .then(data => data)
      .catch(err => console.log(err))

    let newAttacks = attacks.filter(attack => {
      let matchingMissions = missions.filter(mission => mission.id === attack.mission_id)
      return !attack.is_deleted && matchingMissions.length > 0
    })

    state.setAttacks(newAttacks)

    return newAttacks
  }

  useEffect(async () => {
    if (state.user === undefined) {
      state.setMissions(null)
    } else if (keycloak.authenticated && state.currentEvent) {
      let newMissions = await fetchMissions()
      let newAttacks = await fetchAttacks(newMissions)
      let newTeams = await fetchTeams();
      await fetchUsers(newTeams);
    }
  }, [state.user, keycloak.authenticated, state.currentEvent])

  return (
    <>
      {state.currentEvent ?
        <div className='event-wrapper'>
          <div className='event'>
            <h1 className='event-title'>{state.currentEvent.name}</h1>

            <div className='info'>
              <div className='info-labels'>
                <div className='entry'>Start:</div>
                <div className='entry'>End:</div>
                <div className='entry'>Attacks:</div>
                <div className='entry'>Participants:</div>
              </div>
              <div className='info-values'>
                <div className='entry'>{(new Date(state.currentEvent.start_date)).toDateString() || <>&nbsp;</>}</div>
                <div className='entry'>{(new Date(state.currentEvent.end_date)).toDateString() || <>&nbsp;</>}</div>
                <div className='entry'>{state.attacks?.length || '0'}</div>
                <div className='entry'>{state.users?.length || '0'}</div>
              </div>
            </div>

            <div className='info'>
              <div className='info-labels desc'>
                <div>Description:</div>
              </div>
              <div className='info-values info-values desc-val'>
                <div>{state.currentEvent.description || <>&nbsp;</>}</div>
              </div>
            </div>

        </div>

        </div> : <></>
      }
    </>
  )
}

export default Event;