import React, { useState, useEffect, useContext } from 'react'
import { StateContext } from '../App.js'
import './styles/AttackCard.css'
import AttackDetails from './AttackDetails'

const AttackCard = ({ attack, mission, add, fetchAttacks, refresh }) => {
  const state = useContext(StateContext)
  const [riskLevel, setRiskLevel] = useState();

  useEffect(() => {
    if (attack.mission_impact_score + attack.likelihood_score >= 8) {
      setRiskLevel('high');
    }  else if (attack.likelihood_score === 1 || attack.mission_impact_score + attack.likelihood_score <= 5) {
      setRiskLevel('low')
    } else {
      setRiskLevel('medium')
    }
  }, [])

  const onAdd = () => {
    const eventsCopy = [...state.events]
    eventsCopy.push({
      name: `System ${state.events.length + 1} CTT`,
      id: state.events.length + 1
    });
    state.setEvents(eventsCopy);
  }

  const onClickEvent = () => {
    if (state.currentAttack?.id !== attack.id) {
      state.setCurrentAttack(attack)
    }
  }

  const clickHandler = add ? onAdd : onClickEvent

  return (
    <div className='attack-card-wrapper' onClick={clickHandler}>
      {state.currentAttack?.id !== attack.id ?
        <div className='attack-card'>
          <div className={`attack-id info-${riskLevel}`}>
            {`M${mission.number}A${attack.attack}V${attack.variant}`}
          </div>
          <div className='attack-info'>
            <div className='attack-info-item border-right border-bottom'>
              <div className='attack-title'>
                Description
              </div>
              <div className='attack-value'>
                {attack.description}
              </div>
            </div>
            <div className='attack-info-item border-right border-bottom'>
              <div className='attack-title'>
                Goal
              </div>
              <div className='attack-value'>
                {attack.goal}
              </div>
            </div>
            <div className='attack-info-item'>
              <div className='attack-title'>
                Assumptions
              </div>
              <div className='attack-value'>
                {attack.assumptions}
              </div>
            </div>
          </div>
        </div> :
        <AttackDetails attack={attack} mission={mission} fetchAttacks={fetchAttacks} refresh={refresh}/>
      }
    </div>

  )
}

export default AttackCard;