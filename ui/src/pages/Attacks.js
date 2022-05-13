import React, { useState, useEffect, useContext } from 'react'
import { StateContext } from '../App.js'
import './styles/Attacks.css'
import { useKeycloak } from '@react-keycloak/web'
import { RuxTabs, RuxTab, RuxTabPanels, RuxTabPanel } from '@astrouxds/react'
import AttackCard from '../components/AttackCard'
import AttackDetails from '../components/AttackDetails'


const Attacks = () => {
  const state = useContext(StateContext)
  const { keycloak, initialized } = useKeycloak();
  const [addAttack, setAddAttack] = useState(false);
  const [editMission, setEditMission] = useState(false)

  const fetchMissions = async () => {
    const request = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${keycloak.token}`
      }
    }
    let missions = await fetch(`${state.serverURL}/api/offices/${state.user.office_id}/events/${state.currentEvent.id}/missions`, request)
      .then(response => response.json())
      .then(data => data)
      .catch(err => console.log(err))
    let newMissions = await missions.filter(mission => !mission.is_deleted).sort((a, b) => a.number - b.number)
    state.setMissions(newMissions)
    return newMissions
  }

  const addAttackHandler = async (e) => {
    e.preventDefault();

  }

  const compareFunction = (a, b) => {
    if (a.attack === b.attack) {
      return a.variant - b.variant
    }
    return a.attack - b.attack
  }

  const filterAndSortAttacks = (attacks, mission) => {
    if (attacks && mission) {
      let arrayCopy = [...attacks]
      arrayCopy = arrayCopy.filter(attack => attack.mission_id === mission.id)
      arrayCopy = arrayCopy.sort(compareFunction)
      return arrayCopy
    }
    return []

  }

  const fetchAttacks = async (missions) => {
    const request = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${keycloak.token}`
      }
    }

    let attacks = await fetch(`${state.serverURL}/api/offices/${state.user.office_id}/events/${state.currentEvent.id}/attacks`, request)
      .then(response => response.json())
      .then(data => data)
      .catch(err => console.log(err))

    console.log(missions)
    let newAttacks = attacks.filter(attack => {
      let matchingMissions = missions.filter(mission => mission.id === attack.mission_id)
      return !attack.is_deleted && matchingMissions.length > 0
    })

    state.setAttacks(newAttacks)

    return newAttacks
  }

  const refresh = async () => {
    await state.setMissions(null)
    let user = state.user ?? await state.fetchUserInfo()
    await state.fetchEvents(user)
    let newMissions = await fetchMissions()
    let newAttacks = await fetchAttacks(newMissions)
  }

  useEffect(() => {
    if (state.user === undefined) {
      state.setMissions(null)
    } else {
      keycloak.authenticated && state.currentEvent && refresh()
    }
  }, [state.user, keycloak.authenticated, state.currentEvent])

  const deleteMissionHandler = async (mission) => {
    if (window.confirm("Are you sure you want to permanently delete this mission along with all attacks belonging to this mission?")) {
      const request = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${keycloak.token}`
        }
      }
      filterAndSortAttacks(state.attacks, mission).forEach(async attack => {
        let attacks = await fetch(`${state.serverURL}/api/offices/${state.user.office_id}/events/${state.currentEvent.id}/attacks/${attack.id}`, request)
          .then(response => response.json())
          .then(data => data)
          .catch(err => console.log(err))
      })
      let returnedMission = await fetch(`${state.serverURL}/api/offices/${state.user.office_id}/events/${state.currentEvent.id}/missions/${mission.id}`, request)
        .then(response => response.json())
        .then(data => data)
        .catch(err => console.log(err))
      state.setCurrentAttack(null)
      refresh()
    }
  }

  const editMissionHandler = async (e, mission) => {
    e.preventDefault();
    let newMission = {
      name: e.target.name.value,
      number: e.target.number.value
    }
    const request = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${keycloak.token}`
      },
      body: JSON.stringify(newMission)
    }
    let deletedMission = await fetch(`${state.serverURL}/api/offices/${state.user.office_id}/events/${state.currentEvent.id}/missions/${mission.id}`, request)
      .then(response => response.json())
      .then(data => data)
      .catch(err => console.log(err))

    setEditMission(false);
    refresh();
  }

  const addMissionHandler = async (e) => {
    e.preventDefault();
    let newMission = {
      name: e.target.name.value,
      number: e.target.number.value,
      is_deleted: false
    }
    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${keycloak.token}`
      },
      body: JSON.stringify(newMission)
    }
    let addedMission = await fetch(`${state.serverURL}/api/offices/${state.user.office_id}/events/${state.currentEvent.id}/missions/`, request)
      .then(response => response.json())
      .then(data => data)
      .catch(err => console.log(err))

    setEditMission(false);
    await refresh();
    state.setCurrentMission(addedMission);
  }


  return ( state.missions && state.attacks ?
    <div className='attacks'>
    <RuxTabs id="tab-set-id-1" small>
      {state.missions.map(mission =>
        <RuxTab id={`tab-id-${mission.id}`} key={`tab-id-${mission.id}`} selected={state.currentMission && mission.id === state.currentMission.id ? 'selected': false} onClick={() => state.setCurrentMission(mission)}>
          {mission.name}
        </RuxTab>
      )}
      <RuxTab id="tab-id-add">+</RuxTab>
    </RuxTabs>

    <RuxTabPanels aria-labelledby="tab-set-id-1">
      {state.missions.map(mission => {
        return (
          <RuxTabPanel aria-labelledby={`tab-id-${mission.id}`} key={`tab-id-${mission.id}`}>
            <div className='attack-list'>
              <h2>
                {editMission ?
                  <>
                    <form className='edit-mission-name' onSubmit={(e) => editMissionHandler(e, mission)}>
                      Mission <input className='edit-mission-number' type='number' name='number' id='number' min='0' defaultValue={mission.number}/> :
                      <input className='edit-name' type='text' name='name' id='name' defaultValue={mission.name}/>
                      <input className='button' type='submit' value='Save changes'/>
                      <img className='svg edit-mission' src='/trash-solid.svg' alt='trash'  title='delete mission' onClick={() => deleteMissionHandler(mission)}/>
                      <img className='svg edit-mission' src='/x-solid.svg' alt='close'  title='cancel edit' onClick={() => setEditMission(false)}/>
                    </form>
                  </> :
                  <>
                    {`Mission ${mission.number}: ${mission.name}`}
                    <img className='svg edit-mission' src='/pencil-solid.svg' alt='edit'  title='edit mission' onClick={() => setEditMission(true)}/>
                  </>
                }
              </h2>
              <button className='add-attack-button' onClick={() => setAddAttack(!addAttack)}>+</button>
              {addAttack ? <AttackDetails attack={{}} fetchAttacks={fetchAttacks} addAttack='true' setAddAttack={setAddAttack} refresh={refresh} mission={mission}/> : ''}
              {filterAndSortAttacks(state.attacks, mission).map(attack => <AttackCard key={`attack-id-M${mission.number}A${attack.attack}V${attack.variant}`} attack={attack} mission={mission} fetchAttacks={fetchAttacks} refresh={refresh}/>)}
            </div>
          </RuxTabPanel>
        )
      })}
      <RuxTabPanel aria-labelledby="tab-id-add">
        <h2 className='center'>
          <form className='edit-mission-name' onSubmit={addMissionHandler}>
            Mission <input className='edit-mission-number' type='number' name='number' id='number' min='0' placeholder='3'/> :
            <input className='edit-name' type='text' name='name' id='name' placeholder='disrupt comms...'/>
            <input className='button' type='submit' value='Add new mission'/>
          </form>
        </h2>

      </RuxTabPanel>
    </RuxTabPanels>

    </div> : ''
  )
}

export default Attacks;