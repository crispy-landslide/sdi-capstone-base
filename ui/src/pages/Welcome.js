import React, { useState, useEffect, useContext } from 'react'
import { StateContext } from '../App.js'
import EventCard from '../components/EventCard'
import './styles/Welcome.css'

const Welcome = () => {
  const state = useContext(StateContext)
  const [filteredEvents, setFilteredEvents] = useState(state.events);
  const [activeButton, setActiveButton] = useState('all');

  const filterEvents = (checker) => {
    let events = state.events?.filter(event => state.currentOffice.id === event.office_id)
    if (checker === 'all') {
      setFilteredEvents(events)
      setActiveButton('all')
    } else if (checker === 'past') {
      setFilteredEvents(events.filter(event => new Date(event.start_date) < new Date()))
      setActiveButton('past')
    } else {
      setFilteredEvents(events.filter(event => new Date(event.start_date) >= new Date()))
      setActiveButton('upcoming')
    }
  }

  useEffect(() => {
    setFilteredEvents(state.events)
  }, [state.events, state.currentOffice])

  const changeOffice = (event) => {
    console.log(event.target.value)
    state.setCurrentOffice(state.user?.offices.filter(office => office.id == event.target.value)[0])
  }

  return (
    <div className='welcome-wrapper'>
      {state.user.offices ?
        <div className='office-selector'>
          <div className='office-selector-label'>
            Select Office
          </div>
          <div>
            {state.currentOffice ?
            <select onChange={changeOffice} className='edit-number selection' defaultValue={state.currentOffice.id}>
              <option hidden value={state.currentOffice.id}>{state.currentOffice.name}</option>
              {state.user.offices.map(office => <option key={office.id} value={office.id}>{office.name}</option>)}
            </select> : ''
            }

        </div>
        </div>

        : ''
      }
      {state.events && filteredEvents ?
        <div className='filter-buttons'>
          <button className={`button ${activeButton === 'all' ? 'active' : ''}`} onClick={() => filterEvents('all')}>All Events</button>
          <button className={`button ${activeButton === 'past' ? 'active' : ''}`} onClick={() => filterEvents('past')}>Past Events</button>
          <button className={`button ${activeButton === 'upcoming' ? 'active' : ''}`} onClick={() => filterEvents('upcoming')}>Upcoming Events</button>
        </div> : ''
      }
      <div className='welcome'>
        <EventCard event={{name: '+'}} add='add'/>
        {state.events && filteredEvents ? filteredEvents.filter(event => state.currentOffice.id === event.office_id && !event.is_deleted).map(event => <EventCard key={event.id} event={event}/>) : ''}
      </div>
    </div>
  )
}

export default Welcome;