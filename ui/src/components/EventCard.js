import React, { useContext } from 'react'
import { StateContext } from '../App.js'
import './styles/EventCard.css'
import { useNavigate } from 'react-router-dom'
import { useKeycloak } from '@react-keycloak/web'

const EventCard = ({ event, add }) => {
  const state = useContext(StateContext);
  const navigate = useNavigate();
  const { keycloak, initialized } = useKeycloak();

  const onAdd = async () => {
    const newEvent = {
      start_date: (new Date()).toISOString(),
      end_date: (new Date()).toISOString(),
      name: `System ${state.events ? state.events.length + 1 : ''} CTT`,
      report_path: '',
      tags: '',
      description: '',
      is_deleted: false,
      office_id: state.currentOffice.id
    }
    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${keycloak.token}`
      },
      body: JSON.stringify(newEvent)
    }
    let url = `${state.serverURL}/api/offices/${state.currentOffice.id}/events`

    const returnEvent = await fetch(url, request)
      .then(response => response.json())
      .then(data => data)
      .catch(err => console.error(err))

    state.setCurrentEvent(returnEvent[0])
    await state.fetchEvents(state.user);
    navigate(`/offices/${state.currentOffice.id}/events/${returnEvent[0].id}/settings`)
  }

  const onClickEvent = () => {
    console.log(event)
    state.setCurrentEvent(event)
    navigate(`/offices/${state.currentOffice.id}/events/${event.id}`)
  }

  const clickHandler = add ? onAdd : onClickEvent

  return (
    <div className={`event-card ${add ?? ''}`} onClick={clickHandler}>
      {event.name}
    </div>
  )
}

export default EventCard;