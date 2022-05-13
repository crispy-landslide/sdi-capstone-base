import React, { useState, useEffect, useContext } from 'react'
import { StateContext } from '../App.js'
import './styles/RiskMatrix.css'
import RiskBlock from './RiskBlock'

const RiskMatrix = ({ attacks }) => {
  const state = useContext(StateContext)
  const [riskBlocks, setRiskBlocks] = useState();

  useEffect(() => {
    if (state.attacks) {
      const riskRows = [];
      for(let i = 5; i >= 0; i--) {
        const riskColumns = [];
        for (let j = 0; j <= 5; j++) {
          riskColumns.push(<RiskBlock key={`risk-block-${i}-${j}`} row={j} column={i} attacks={attacks.filter(attack => j === attack.mission_impact_score && i === attack.likelihood_score)}/>)
        }
        riskRows.push(<div key={`risk-row-${i}`} className='risk-row'>{riskColumns}</div>)
      }
      setRiskBlocks(riskRows);
    }

  }, [state.attacks])

  return (
    <div className='risk-matrix'>
      <div className='y-label-wrapper'>
        <div className='y-label'>
          Likelihood of Success
        </div>
        <div className='x-label-wrapper'>
          {riskBlocks}
          <div className='x-label'>
            Mission Impact Level
          </div>
        </div>
      </div>
    </div>

  )
}

export default RiskMatrix;