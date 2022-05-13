import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { StateContext } from '../App.js'
import './styles/RiskBlock.css'

const RiskBlock = ({ row, column, attacks}) => {
  const state = useContext(StateContext);
  const [riskLevel, setRiskLevel] = useState();
  const navigate = useNavigate();

  const clickHandler = (attack, matchingMission) => {
    state.setCurrentAttack(attack)
    state.setCurrentMission(matchingMission)
    navigate(`/events/${state.currentEvent.id}/attacks#attack-id-${attack.id}`)
  }

  useEffect(() => {
    if (row + column >= 8) {
      setRiskLevel('high');
    } else if (row === 0 || column === 0) {
      setRiskLevel('label')
    }  else if (row === 1 || row + column <= 5) {
      setRiskLevel('low')
    } else {
      setRiskLevel('medium')
    }
  }, [])

  return (
    <div className={`risk-block ${riskLevel}`}>
        {(row === 0 || column === 0) && row + column >= 1 ? row + column : attacks.length > 0 ?
        <div className='attack-ids'>
          {attacks.map(attack=> {
            let matchingMissions = state.missions.filter(mission => mission.id === attack.mission_id)
            return matchingMissions.length > 0 ?
              (
              <div key={`attack-id-${attack.id}`} onClick={() => clickHandler(attack, matchingMissions[0])} className={`attack-id-link  ${riskLevel}`}>
                M{matchingMissions[0].number}A{attack.attack}V{attack.variant}
              </div>
            ) : ''
          })}
        </div> : ''
      }
    </div>
  )
}

export default RiskBlock;