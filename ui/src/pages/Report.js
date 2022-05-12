import React, { useEffect, useContext } from 'react'
import { StateContext } from '../App.js'
import './styles/Report.css'
import { useKeycloak } from '@react-keycloak/web'
import RiskMatrix from '../components/RiskMatrix'

const Report = () => {
  const state = useContext(StateContext)
  const { keycloak, initialized } = useKeycloak();

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

    state.setAttacks(attacks.filter(attack => !attack.is_deleted))
    return attacks
  }

  useEffect(() => {
    if (keycloak.authenticated && state.user && state.currentEvent) {
      fetchAttacks();
    }
  }, [keycloak.authenticated, state.user, state.currentEvent])

  console.log(state.attacks)

  return ( state.currentEvent ?
    <div className='report'>
      <RiskMatrix attacks={state.attacks}/>
    </div> : ''
  )
}

export default Report;