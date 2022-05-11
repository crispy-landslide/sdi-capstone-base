import { RuxTabs, RuxTab, RuxTabPanels, RuxTabPanel, RuxModal, RuxButton } from '@astrouxds/react'
import {RuxTable, RuxTableHeader, RuxTableHeaderRow, RuxTableHeaderCell, RuxTableBody, RuxTableRow , RuxTableCell} from '@astrouxds/react'

import React, { useContext, useState, useEffect } from 'react'
import { StateContext } from '../App.js'
import './styles/Teams.css'
import keycloak from '../keycloak'

const Teams = () => {
  const { user, teams, setTeams, currentEvent, users, setUsers, serverURL } = useContext(StateContext)

  // dynamic tab notes
  // on component mount, request teams from backend and save to state
  // also, on component mount, request users from all teams
  // generate all tabs based on the given teams
  // generate content of each tab based on given users from request

  // + tab notes
  //hit the tab
  //empty form input becomes editable
  //on submit make a post request and change state
  //add a tab behing the tab-adder 
  //OR add a new tab-adder infront of the 

  const [modalIsOpen, setModalIsOpen] = useState(false)
  
  const handleInput = (event) => {
    event.preventDefault()

    setModal(true)

  }

  useEffect(async () => {
    await setTeams(null)
    setUsers([])
    const teams = await getTeamsData()
    await getUsersData(teams)    
  }, [])

  const getTeamsData = async () => {
    const request = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${keycloak.token}`
      }
    }
    //below grabs all the teams for this particular event
    let teams = await fetch(`${serverURL}/api/offices/${user.office_id}/events/${currentEvent.id}/teams`, request)
            .then(response => response.json())
            .then(data => {
              let filteredTeams = data.filter(team => team.is_deleted === false)
              setTeams(filteredTeams)
              return filteredTeams
            })
            .catch(err => console.log(err))
    
    return teams
    }


  const getUsersData = async (teams) => {
    const request = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${keycloak.token}`
      }
    }

    let newUsers = []
    await teams.forEach(async team => {
      await fetch(`${serverURL}/api/offices/${user.office_id}/events/${currentEvent.id}/teams/${team.id}/users`, request)
            .then(response => response.json())
            .then(data => data.filter(users => users.is_deleted === false))
            .then(filteredUsers => {
              newUsers = [...newUsers, ...filteredUsers]
              console.log(newUsers)
              setUsers(newUsers)
            })
            .catch(err => console.log(err))
    })
    

    // console.log(newUsers)
    // await setUsers(newUsers)
  }

  const handleSubmit = (event) =>{
    event.preventDefault()

  //   let newTeamName = event.target.newTeamName.value

  //   let addNewTeam = {
  //     name:newTeamName
  //   }

  //   let request = {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type' : 'application/json'
  //     },
  //     body: JSON.stringify(addNewTeam)
  //   }

  //   fetch('http://localhost:3001/api/offices/:office_id/events/:event_id/teams', request)
  //   .then(() => /* run function in useEffect*/ )

  console.log(event.target.newTeamName.value)
  }

  const handleModalOpen = (event) => {
    event.preventDefault();
    modalIsOpen ? null : setModalIsOpen(true)
  }

  const handleModalClose = (event) => {
    event.preventDefault();
    modalIsOpen ? setModalIsOpen(false) : null
  }


  const addParticipant = (e) => {
    e.preventDefault()

    console.log('participant added')
  }

  return (
    teams && users ? 
    <div>
      { modalIsOpen ? 

      <div className='newTabContainer'>
        <div className='newTabBlock'> 
          <button onClick={(e) => handleModalClose(e)}> X </button>
          <h2>Create a new team!</h2>
          <form className='newTabForm' onSubmit={event => handleSubmit(event)}>
            <input type='text' placeholder='Give a new team name...' id='newTeamName' name='newTeamName' /> 
            <input type='submit' value='submit'/>
          </form>
        </div>
      </div>

      :
      null
      } 
      <div className='teams'>
        {/* {console.log(users)} */}
        {/* for every team, there must be a tab, a panel for the tab, and a table for each panel */}


        <RuxTabs id="tab-set-teams" small="true">
        {/* This is a dynamic a tab */}
          {teams.map(team => <RuxTab onClick={(e) => handleModalClose(e)} id={`tab-id-${team.id}`} key={`tab-id-${team.id}`}>{team.name} </RuxTab>)}
          <RuxTab id="tab-adder" onClick={(e) => handleModalOpen(e)}> + </RuxTab>
        </RuxTabs>

        
        {/* for every team, there must be a tab, a panel for the tab, and a table for each panel */}
        <RuxTabPanels aria-labelledby="tab-set-teams">
        {teams.map((team) =>
          <RuxTabPanel aria-labelledby={`tab-id-${team.id}`} key={`tab-id-${team.id}`}>
            <RuxButton size='medium' className='addParticipantButton' onClick={(e) => addParticipant(e)}>Add Participant</RuxButton>
            <RuxTable>
                <RuxTableHeader>
                  <RuxTableHeaderRow>
                    <RuxTableHeaderCell> First Name </RuxTableHeaderCell>
                    <RuxTableHeaderCell> Last Name </RuxTableHeaderCell>
                    <RuxTableHeaderCell> Role </RuxTableHeaderCell>
                    <RuxTableHeaderCell> Email </RuxTableHeaderCell>
                    <RuxTableHeaderCell> Is Editor </RuxTableHeaderCell>
                    <RuxTableHeaderCell> Is Admin </RuxTableHeaderCell>
                  </RuxTableHeaderRow>
                </RuxTableHeader>
                  <RuxTableBody>
                    {users?.map((user) => {
                      if(user.team_id === team.id){
                        {/* console.log(user) */}
                        return(
                          <RuxTableRow >
                            <RuxTableCell> {user.first_name} </RuxTableCell>
                            <RuxTableCell> {user.last_name} </RuxTableCell>
                            <RuxTableCell> {user.role} </RuxTableCell>
                            <RuxTableCell> {user.email} </RuxTableCell>
                            <RuxTableCell> {user.is_editor.toString()} </RuxTableCell>
                            <RuxTableCell> {user.is_admin.toString()} </RuxTableCell>
                         </RuxTableRow>
                        )
                      }
                    })}
                </RuxTableBody>
            </RuxTable>
          </RuxTabPanel>
          )}
        </RuxTabPanels>
      </div>
    </div>
    : 
    null
  )
}
export default Teams;