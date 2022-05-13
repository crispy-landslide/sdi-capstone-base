import React, { useEffect, useState, useContext } from 'react'
import { StateContext } from '../App.js'
import './styles/Report.css'
import { useKeycloak } from '@react-keycloak/web'
import RiskMatrix from '../components/RiskMatrix'

const Report = () => {
  const state = useContext(StateContext)
  const [riskNumbers, setRiskNumbers] = useState();
  const { keycloak, initialized } = useKeycloak();

  const getRiskNumbers = (attacks) => {
    let riskNumbers = {high: 0, medium: 0, low: 0}
    for (let attack of attacks) {
      let row = attack.likelihood_score
      let column = attack.mission_impact_score
      if (row + column >= 8 && row + column <= 10) {
        riskNumbers.high++
      }  else if (row === 1 || row + column <= 5) {
        riskNumbers.low++
      } else if (row + column >= 6 && row + column <= 7) {
        riskNumbers.medium++
      }
    }
    setRiskNumbers(riskNumbers)
    return riskNumbers
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

    let newAttacks = attacks.filter(attack => {
      let matchingMissions = missions.filter(mission => mission.id === attack.mission_id)
      return !attack.is_deleted && matchingMissions.length > 0
    })

    state.setAttacks(newAttacks)

    return newAttacks
  }

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

  useEffect(async () => {
    if (keycloak.authenticated && state.user && state.currentEvent) {
      let newMissions = await fetchMissions();
      let newAttacks = await fetchAttacks(newMissions);
      await getRiskNumbers(newAttacks);
    }
  }, [keycloak.authenticated, state.user, state.currentEvent])

  return ( state.currentEvent && riskNumbers ?
    <div className='report-wrapper'>
      <h1>Report</h1>
      <div className='report'>
        <div className='report-info'>
          <div className='info-item'>
            Total Attacks: <b>{state.attacks.length}</b>
          </div>
          <div className='info-item info-high'>
            High Risk: <b>{riskNumbers.high}</b>
          </div>
          <div className='info-item info-medium'>
            Medium Risk: <b>{riskNumbers.medium}</b>
          </div>
          <div className='info-item info-low'>
            Low Risk: <b>{riskNumbers.low}</b>
          </div>
        </div>
        <div className='vertical-line'/>
        {state.attacks?.length > 0 ? <RiskMatrix attacks={state.attacks}/> : ''}
      </div>
    </div>
     : ''
  )
}

export default Report;