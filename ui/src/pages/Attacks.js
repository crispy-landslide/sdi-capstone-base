import React, { useState, useEffect, useContext } from 'react'
import { StateContext } from '../App.js'
import './styles/Attacks.css'
import { useKeycloak } from '@react-keycloak/web'
import { RuxTabs, RuxTab, RuxTabPanels, RuxTabPanel } from '@astrouxds/react'
import AttackCard from '../components/AttackCard'
import AttackDetails from '../components/AttackDetails'


const Attacks = () => {
  const state = useContext(StateContext)
  const [missions, setMissions] = useState();
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
    setMissions(await missions.sort((a, b) => a.number - b.number))
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

  const fetchAttacks = async () => {
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

    state.setAttacks(attacks)
    return attacks
  }

  const refresh = async () => {
    let user = state.user ?? await state.fetchUserInfo()
    await state.fetchEvents(user)
    await fetchMissions()
    let newAttacks = await fetchAttacks()
  }

  useEffect(() => {
    if (state.user === undefined) {

    } else {
      keycloak.authenticated && state.currentEvent && (fetchMissions() && fetchAttacks())
    }
  }, [state.user, keycloak.authenticated, state.currentEvent])

  return ( missions && state.attacks ?
    <div className='attacks'>
    <RuxTabs id="tab-set-id-1" small>
      {missions.map(mission => <RuxTab id={`tab-id-${mission.id}`} key={`tab-id-${mission.id}`}>Mission {mission.number}</RuxTab>)}
      <RuxTab id="tab-id-add">+</RuxTab>
    </RuxTabs>

    <RuxTabPanels aria-labelledby="tab-set-id-1">
      {missions.map(mission => {
        return (
          <RuxTabPanel aria-labelledby={`tab-id-${mission.id}`} key={`tab-id-${mission.id}`}>
            <div className='attack-list'>
              <h2>
                {editMission ?
                  <>
                    {`Mission ${mission.number}: ${mission.name}`}
                    <img className='svg edit-mission' src='/trash-solid.svg' alt='trash'  title='delete mission'/>
                    <img className='svg edit-mission' src='/x-solid.svg' alt='close'  title='cancel edit'/>
                  </> :
                  <>
                    {`Mission ${mission.number}: ${mission.name}`}
                    <img className='svg edit-mission' src='/pencil-solid.svg' alt='edit'  title='edit mission'/>
                  </>
                }
              </h2>
              <button className='add-attack-button' onClick={() => setAddAttack(!addAttack)}>+</button>
              {addAttack ? <AttackDetails attack={{}} fetchAttacks={fetchAttacks} addAttack='true' setAddAttack={setAddAttack} refresh={refresh} mission={mission}/> : ''}
              {filterAndSortAttacks(state.attacks, mission).map(attack => <AttackCard key={`attack-id-M${mission.number}A${attack.attack}V${attack.variant}`} attack={attack} mission={mission} missions={missions} fetchAttacks={fetchAttacks} refresh={refresh}/>)}
            </div>
          </RuxTabPanel>
        )
      })}
      <RuxTabPanel aria-labelledby="tab-id-add">
        Add a new mission
      </RuxTabPanel>
    </RuxTabPanels>

    </div> : ''
  )
}

export default Attacks;