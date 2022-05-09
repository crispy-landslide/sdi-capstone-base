import React, { useState, useEffect, useContext } from 'react'
import { StateContext } from '../App.js'
import './styles/Attacks.css'
import { RuxTabs, RuxTab, RuxTabPanels, RuxTabPanel } from '@astrouxds/react'
import AttackCard from '../components/AttackCard'


const Attacks = () => {
  const state = useContext(StateContext)
  const [missions, setMissions] = useState()

  const findMissions = () => {
    let missions = []
    for (let attack of state.attacks) {
      if (missions.indexOf(attack.mission) === -1) {
        missions.push(attack.mission)
      }
    }
    setMissions(missions.sort())
  }

  useEffect(() => {
    findMissions()
  }, [])


  return ( missions ?
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
              {state.attacks.filter(attack => attack.mission === mission).map(attack => <AttackCard key={`attack-id-M${mission}A${attack.attack}V${attack.variant}`} attack={attack} />)}
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