import React, { useState, useContext } from 'react'
import { StateContext } from '../App.js'
import './styles/AttackDetails.css'

const AttackDetails = ({ attack }) => {
  const state = useContext(StateContext)
  const [edit, setEdit] = useState(false)

  const closeHandler = () => {
    state.setCurrentAttack(null)
  }

  const editHandler = () => {
    setEdit(!edit)
  }

  const submitHandler = (event) => {
    event.preventDefault()
    let updatedAttack = {
      description: event.target.description.value,
      goal: event.target.description.assumptions,
    }
    console.log(event.target)
  }

  return (
        <form className='attack-details' onSubmit={submitHandler}>
          <div className='attack-details-id-nav'>
            <div className='attack-details-nav'>
              <img className='close' src='/x-solid.svg' alt='close' onClick={closeHandler} title='close attack'/>
              <img className='edit' src='/pencil-solid.svg' alt='edit' onClick={editHandler} title='edit attack'/>
            </div>
            <div className='attack-details-id'>
              {`M${attack.mission}A${attack.attack}V${attack.variant}`}
            </div>
            <div className='submit-button-placeholder'>
              {edit ?
                <input className='submit-button' type='submit' value='Save Changes' /> :
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
                  {edit ?
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
                  {edit ?
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
                  {edit ?
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
                  {edit ?
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
                  {edit ?
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
                    {edit ?
                      <input className='edit-number' type='number' name='mission_impact_score' id='mission_impact_score' min='1' max='5' defaultValue={attack.mission_impact_score}/> :
                      attack.mission_impact_score
                    }
                  </div>
                </div>
                <div className='score'>
                  <div className='attack-details-title'>
                    Likelihood Score
                  </div>
                  <div className='attack-details-value'>
                    {edit ?
                      <input className='edit-number' type='number' name='likelihood_score' id='likelihood_score' min='1' max='5' defaultValue={attack.likelihood_score}/> :
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