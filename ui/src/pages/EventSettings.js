import React, { useState, useEffect, useContext } from 'react'
import { StateContext } from '../App.js'
import { useNavigate } from 'react-router-dom'
import './styles/EventSettings.css'
import { useKeycloak } from '@react-keycloak/web'

const EventSettings = () => {
  const state = useContext(StateContext)
  const {keycloak, initialized} = useKeycloak();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()

  const formatDate = (date) => {
    return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}-${`${date.getDate()}`.padStart(2, '0')}`
  }

  const submitHandler = async (event) => {
    event.preventDefault()
    if (window.confirm("Are you sure you want to make these changes?")) {
      let updatedEvent = {
        name: event.target.name.value,
        start_date: event.target.start_date.value,
        end_date: event.target.end_date.value,
        description: event.target.description.value
      }
      const request = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${keycloak.token}`
        },
        body: JSON.stringify(updatedEvent)
      }
      let url = `${state.serverURL}/api/offices/${state.currentOffice.id}/events/${state.currentEvent.id}`

      const returnEvent = await fetch(url, request)
        .then(response => response.json())
        .then(data => data)
        .catch(err => console.error(err))

      state.setCurrentEvent(returnEvent[0])
      setStartDate(new Date(returnEvent[0].start_date))
      setEndDate(new Date(returnEvent[0].end_date))
      await state.fetchEvents(state.user);
      navigate(`/offices/${state.currentOffice.id}/events/${state.currentEvent.id}`)
    }
  }

  useEffect(() => {
    if (state.currentEvent) {
      setStartDate(new Date(state.currentEvent.start_date))
      setEndDate(new Date(state.currentEvent.end_date))
    }
  }, [state])

  const deleteHandler = async () => {
    if (window.confirm("Are you sure you want to permanently delete this event?")) {
      const request = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${keycloak.token}`
        }
      }
      let url = `${state.serverURL}/api/offices/${state.currentOffice.id}/events/${state.currentEvent.id}`

      const returnEvent = await fetch(url, request)
        .then(response => response.json())
        .then(data => data)
        .catch(err => console.error(err))
      state.setCurrentEvent(null)
      await state.fetchEvents(state.user);
      navigate('/')
    }
  }

  return ( keycloak.authenticated && state.user ?
    <>
      {state.currentEvent ?
      <div className='event-wrapper'>
        <div className='event'>
          <form onSubmit={submitHandler}>
            <h1>Settings for <input className='set-title' type='text' name='name' id='name' defaultValue={state.currentEvent.name} /></h1>
            <div className='info'>
              <div className='info-labels'>
                <div className='entry'>Start:</div>
                <div className='entry'>End:</div>
              </div>
              <div className='info-values'>
                <input className='set-date' type='date' name='start_date' id='start_date' defaultValue={startDate ? formatDate(startDate) : ''} />
                <input className='set-date' type='date' name='end_date' id='end_date' defaultValue={endDate ? formatDate(endDate) : ''} />

              </div>
            </div>

            <div className='info'>
              <div className='info-labels desc'>
                <div>Description:</div>
              </div>
              <div className='info-values desc desc-val'>
                <textarea className='set-text' name='description' id='description' defaultValue={state.currentEvent.description} />
              </div>
            </div>
            <input className='button submit' type='submit' value='Save Changes' />
          </form>

          <hr className='rule'/>
          <div className='danger-zone' >
            <h1>Danger Zone</h1>
            <button className='button delete' type='button' onClick={deleteHandler}>
              Delete Event
            </button>
          </div>


        </div>
      </div>
      : <></>
      }
    </> : ''
  )
}

export default EventSettings;