import React, { useState, useContext } from 'react'
import './styles/Header.css'
import { useKeycloak } from '@react-keycloak/web'
import { StateContext } from "../App.js";
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'


/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
  document.getElementById("sidebar") && (document.getElementById("sidebar").style.width = "250px");
  document.getElementById("main-page") && (document.getElementById("main-page").style.marginLeft = "250px");
  document.getElementById("main-page") && (document.getElementById("main-page").style.width = "calc(100vw - 250px)");
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("sidebar") && (document.getElementById("sidebar").style.width = "0");
  document.getElementById("main-page") && (document.getElementById("main-page").style.marginLeft = "0");
  document.getElementById("main-page") && (document.getElementById("main-page").style.width = "100vw");
}


const Header = () => {
  const state = useContext(StateContext)
  const navigate = useNavigate()
  const [showSidebar, setShowSidebar] = useState(false);
  const { keycloak, initialized } = useKeycloak()

  const goToEvent = () => {
    setShowSidebar(false)
    closeNav()
    navigate(`/offices/${state.currentOffice.id}/events/${state.currentEvent.id}`)
  }


  const goHome = () => {
    state.setCurrentEvent(null)
    setShowSidebar(false)
    closeNav()
    navigate('/')
  }

  const clickHamburger = () => {
    if (showSidebar) {
      closeNav()
    } else {
      openNav()
    }
    setShowSidebar(!showSidebar)

  }

  const clickHandler = () => {
    if (keycloak.authenticated) {
      keycloak.logout()
    } else {
      keycloak.login()
    }
  }

  return (
    <>
    <Sidebar setShowSidebar={setShowSidebar}/>
    <div className='header'>
      <div className='hamburger' >
        {state.currentEvent ?
        <>
          <div className='hamburger-button' onClick={clickHamburger}>&#9776;</div>
          <div className='event-name' onClick={goToEvent}>{state.currentEvent.name}</div>
        </>
          : ''}
      </div>
      <h1 className="title" onClick={goHome}>Trojn</h1>
      <div className='logout-wrapper' onClick={clickHandler}>
        { keycloak.authenticated ?
          <>
            <img className='svg logout' src='/arrow-right-from-bracket-solid.svg' alt='logout' />
            <div className='logout-text'>
              {keycloak?.tokenParsed?.preferred_username}
            </div>
          </> :
          <div className='logout-text login'>
            Login
          </div>
        }
      </div>
    </div>
    </>
  )
}

export default Header;