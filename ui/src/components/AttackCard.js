import React, { useContext } from 'react'
import { StateContext } from '../App.js'
import './styles/AttackCard.css'
import AttackDetails from './AttackDetails'

const AttackCard = ({ attack, mission, missions, add, fetchAttacks, refresh }) => {
  const state = useContext(StateContext)

  const onAdd = () => {
    console.log("Add event");
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
          <div className='attack-id'>
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
        <AttackDetails attack={attack} mission={mission} missions={missions} fetchAttacks={fetchAttacks} refresh={refresh}/>
      }
    </div>

  )
}

export default AttackCard;