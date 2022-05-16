import React, { useState, useEffect, useContext } from 'react'
import { StateContext } from '../App.js'
import EventCard from '../components/EventCard'
import './styles/Welcome.css'

const Welcome = () => {
  const state = useContext(StateContext)
  const [filteredEvents, setFilteredEvents] = useState(state.events);
  const [activeButton, setActiveButton] = useState('all');

  const filterEvents = (checker) => {
    if (checker === 'all') {
      setFilteredEvents(state.events)
      setActiveButton('all')
    } else if (checker === 'past') {
      setFilteredEvents(state.events.filter(event => new Date(event.start_date) < new Date()))
      setActiveButton('past')
    } else {
      setFilteredEvents(state.events.filter(event => new Date(event.start_date) >= new Date()))
      setActiveButton('upcoming')
    }
  }

  useEffect(() => {
    setFilteredEvents(state.events)
  }, [state.events])

  return (
    <div className='welcome-wrapper'>
      {state.events && filteredEvents ?
        <div className='filter-buttons'>
          <button className={`button ${activeButton === 'all' ? 'active' : ''}`} onClick={() => filterEvents('all')}>All Events</button>
          <button className={`button ${activeButton === 'past' ? 'active' : ''}`} onClick={() => filterEvents('past')}>Past Events</button>
          <button className={`button ${activeButton === 'upcoming' ? 'active' : ''}`} onClick={() => filterEvents('upcoming')}>Upcoming Events</button>
        </div> : ''
      }
      <div className='welcome'>
        <EventCard event={{name: '+'}} add='add'/>
        {/* {console.log(state.events)} */}
        {state.events && filteredEvents ? filteredEvents.map(event => <EventCard key={event.id} event={event}/>) : ''}
      </div>
    </div>
  )
}

export default Welcome;