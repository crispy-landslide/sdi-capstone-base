import React, { useState, useEffect, useContext } from 'react'
import { StateContext } from '../App.js'
import './styles/RiskBlock.css'

const RiskBlock = ({ row, column, attacks}) => {
  const state = useContext(StateContext)
  const [riskLevel, setRiskLevel] = useState();

  useEffect(() => {
    if (row + column >= 8) {
      setRiskLevel('high');
    } else if (row === 0 || column === 0) {
      setRiskLevel('label')
    }  else if (column === 1 || row + column <= 5) {
      setRiskLevel('low')
    } else {
      setRiskLevel('medium')
    }
  })

  return (
    <div className={`risk-block ${riskLevel}`}>
      {(row === 0 || column === 0) && row + column >= 1 ? row + column : ''}
    </div>
  )
}

export default RiskBlock;