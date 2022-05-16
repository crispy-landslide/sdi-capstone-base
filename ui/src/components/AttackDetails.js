import React, { useState, useEffect, useContext } from 'react'
import { StateContext } from '../App.js'
import './styles/AttackDetails.css'
import { useKeycloak } from '@react-keycloak/web'

const AttackDetails = ({ attack, mission, fetchAttacks, addAttack, setAddAttack, refresh}) => {
  const state = useContext(StateContext)
  const [edit, setEdit] = useState(false)
  const { keycloak, initialized } = useKeycloak()
  const [riskLevel, setRiskLevel] = useState();

  useEffect(() => {
    if (attack.mission_impact_score + attack.likelihood_score >= 8) {
      setRiskLevel('high');
    }  else if (attack.likelihood_score === 1 || attack.mission_impact_score + attack.likelihood_score <= 5) {
      setRiskLevel('low')
    } else {
      setRiskLevel('medium')
    }
    state.setCurrentMission(state.missions.filter(mission => mission.id === attack.mission_id)[0])
    addAttack && state.setCurrentAttack(null)
    if (window.location.href.indexOf('#attack-id-') > -1) {
      let attackID = window.location.href.split('/attacks#')[1].split('&')[0]
      let element = document.getElementById(attackID);
      element && element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }
  }, [])

  const closeHandler = () => {
    addAttack && setAddAttack(null)
    state.setCurrentAttack(null)
  }

  const editHandler = () => {
    setEdit(!edit)
  }

  const deleteHandler = async () => {
    if (window.confirm('Are you sure you want to permanently delete this attack?')) {
      const request = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${keycloak.token}`
        }
      }
      let attacks = await fetch(`${state.serverURL}/api/offices/${state.currentOffice.id}/events/${state.currentEvent.id}/attacks/${attack.id}`, request)
        .then(response => response.json())
        .then(data => data)
        .catch(err => console.log(err))
      setEdit(!edit)
      state.setCurrentAttack(null)
      refresh()
    }
  }

  const patchAttack = async (updatedAttack) => {
    let method = addAttack ? "POST" : "PATCH"
    const request = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${keycloak.token}`
      },
      body: JSON.stringify(updatedAttack)
    }

    let url = addAttack ?
    `${state.serverURL}/api/offices/${state.currentOffice.id}/events/${state.currentEvent.id}/attacks/` :
    `${state.serverURL}/api/offices/${state.currentOffice.id}/events/${state.currentEvent.id}/attacks/${attack.id}`

    let attacks = await fetch(url, request)
      .then(response => response.json())
      .then(data => data)
      .catch(err => console.log(err))
    setEdit(false)
    addAttack && setAddAttack(false)

    let newAttacks = await fetchAttacks(state.missions);
    if (updatedAttack.mission_id === mission.id) {
      refresh(mission)
    } else {
      refresh(state.missions.filter(mission => mission.id === updatedAttack.mission_id)[0])
    }
    return newAttacks
  }

  const submitHandler = (event) => {
    event.preventDefault()
    let updatedAttack = {
      description: event.target.description.value,
      goal: event.target.goal.value,
      assumptions: event.target.assumptions.value,
      mission_impact: event.target.mission_impact.value,
      likelihood: event.target.likelihood.value,
      mission_impact_score: event.target.mission_impact_score.value,
      likelihood_score: event.target.likelihood_score.value,
      mission_id: event.target.mission?.value || mission.id,
      attack: event.target.attack.value,
      variant: event.target.variant.value
    }
    patchAttack(updatedAttack);

  }


  return (
        <form className='attack-details' onSubmit={submitHandler} id={`attack-id-${attack.id}`}>
          <div className='attack-details-id-nav'>
              <div className='attack-details-nav'>
                <img className='close' src='/x-solid.svg' alt='close' onClick={closeHandler} title='close attack'/>
                {!addAttack && <img className='trash' src='/trash-solid.svg' alt='delete' onClick={deleteHandler} title='delete attack'/>}
                {!addAttack && <img className='edit' src='/pencil-solid.svg' alt='edit' onClick={editHandler} title='edit attack'/>}
              </div>
            {edit || addAttack ?
              <div className='attack-details-edit-id'>
                <div className='edit-attack-id'>
                  <span className='attack-id-component'>
                    M&nbsp;
                  </span>
                  {!addAttack ? <select className='edit-number edit-id' type='number' name='mission' id='mission' defaultValue={mission.id}>
                    <option hidden value={mission.id}>{`${mission.number}: ${mission.name}`}</option>
                    {state.missions.map(m => <option key={m.id} value={m.id}>{`${m.number}: ${m.name}`}</option>)}
                  </select> :
                  <div className='edit-id'>
                    {mission.number}
                  </div>}
                </div>
                <div className='edit-attack-id'>
                  <span className='attack-id-component'>
                    A&nbsp;
                  </span>
                  <input className='edit-number edit-id' type='number' name='attack' id='attack' min='0' defaultValue={attack.attack} required/>
                </div>
                <div className='edit-attack-id'>
                  <span className='attack-id-component'>
                    V&nbsp;
                  </span>
                  <input className='edit-number edit-id' type='number' name='variant' id='variant' min='0' defaultValue={attack.variant} required/>
                </div>
              </div> :
              <div className={`attack-details-id info-${riskLevel}`}>
              {`M${mission.number}A${attack.attack}V${attack.variant}`}
              </div>
            }

            <div className='submit-button-placeholder'>
              {edit || addAttack ?
                <input className='submit-button' type='submit' value='Save Changes' required/> :
                <>&nbsp;</>
              }

            </div>
          </div>
          <div className='attack-details-content'>
            <div className='attack-details-info border-details-bottom'>
              <div className='attack-details-info-item border-details-right'>
                <div className='attack-details-title'>
                  Description
                </div>
                <div className='attack-details-value'>
                  {edit || addAttack ?
                    <textarea className='edit-text' type='text' name='description' id='description' defaultValue={attack.description}/> :
                    attack.description
                  }
                </div>
              </div>
              <div className='attack-details-info-item border-details-right'>
                <div className='attack-details-title'>
                  Goal
                </div>
                <div className='attack-details-value'>
                  {edit || addAttack ?
                    <textarea className='edit-text' type='text' name='goal' id='goal' defaultValue={attack.goal}/> :
                    attack.goal
                  }
                </div>
              </div>
              <div className='attack-details-info-item'>
                <div className='attack-details-title'>
                  Assumptions
                </div>
                <div className='attack-details-value'>
                  {edit || addAttack ?
                    <textarea className='edit-text' type='text' name='assumptions' id='assumptions' defaultValue={attack.assumptions}/> :
                    attack.assumptions
                  }
                </div>
              </div>
            </div>
            <div className='attack-details-info'>
              <div className='attack-details-info-item border-details-right'>
                <div className='attack-details-title'>
                  Mission Impact
                </div>
                <div className='attack-details-value'>
                  {edit || addAttack ?
                    <textarea className='edit-text' type='text' name='mission_impact' id='mission_impact' defaultValue={attack.mission_impact}/> :
                    attack.mission_impact
                  }
                </div>
              </div>
              <div className='attack-details-info-item border-details-right'>
                <div className='attack-details-title'>
                  Likelihood
                </div>
                <div className='attack-details-value'>
                  {edit || addAttack ?
                    <textarea className='edit-text' type='text' name='likelihood' id='likelihood' defaultValue={attack.likelihood}/> :
                    attack.likelihood
                  }
                </div>
              </div>
              <div className='attack-details-info-item scores'>
                <div className='score  border-details-bottom'>
                  <div className='attack-details-title'>
                    Mission Impact Score
                  </div>
                  <div className='attack-details-value'>
                    {edit || addAttack ?
                      <input className='edit-number' type='number' name='mission_impact_score' id='mission_impact_score' min='1' max='5' defaultValue={attack.mission_impact_score || 1}/> :
                      attack.mission_impact_score
                    }
                  </div>
                </div>
                <div className='score'>
                  <div className='attack-details-title'>
                    Likelihood Score
                  </div>
                  <div className='attack-details-value'>
                    {edit || addAttack ?
                      <input className='edit-number' type='number' name='likelihood_score' id='likelihood_score' min='1' max='5' defaultValue={attack.likelihood_score || 1}/> :
                      attack.likelihood_score
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
  )
}

export default AttackDetails;