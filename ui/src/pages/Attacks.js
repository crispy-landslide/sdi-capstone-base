import React, { useState, useEffect, useContext } from 'react'
import { StateContext } from '../App.js'
import './styles/Attacks.css'
import { useKeycloak } from '@react-keycloak/web'
import { RuxTabs, RuxTab, RuxTabPanels, RuxTabPanel } from '@astrouxds/react'
import AttackCard from '../components/AttackCard'


const Attacks = () => {
  const state = useContext(StateContext)
  const [missions, setMissions] = useState()
  const { keycloak, initialized } = useKeycloak()

  const findMissions = (attacks) => {
    let missions = []
    for (let attack of attacks) {
      if (missions.indexOf(attack.mission) === -1) {
        missions.push(attack.mission)
      }
    }
    setMissions(missions.sort())
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
    console.log(attacks)
    findMissions(attacks)
    state.setAttacks(attacks)
    return attacks
  }

  const refresh = async () => {
    let user = await state.fetchUserInfo()
    await state.fetchEvents(user)
  }

  useEffect(() => {
    if (state.user === undefined) {

    } else {
      keycloak.authenticated && state.currentEvent && fetchAttacks()
    }
  }, [state.user, keycloak.authenticated, state.currentEvent])


  return ( missions && state.attacks ?
    <div className='attacks'>
    <RuxTabs id="tab-set-id-1" small>
      {missions.map(mission => <RuxTab id={`tab-id-${mission}`} key={`tab-id-${mission}`}>Mission {mission}</RuxTab>)}

      <RuxTab id="tab-id-add">+</RuxTab>
    </RuxTabs>
    <RuxTabPanels aria-labelledby="tab-set-id-1">
      {missions.map(mission => {
        return (
          <RuxTabPanel aria-labelledby={`tab-id-${mission}`} key={`tab-id-${mission}`}>
            <div className='attack-list'>
              {state.attacks.filter(attack => attack.mission === mission).map(attack => <AttackCard key={`attack-id-M${mission}A${attack.attack}V${attack.variant}`} attack={attack} fetchAttacks={fetchAttacks}/>)}
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