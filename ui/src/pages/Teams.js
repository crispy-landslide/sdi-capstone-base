import { RuxTabs, RuxTab, RuxTabPanels, RuxTabPanel, RuxModal, RuxButton, RuxInput } from '@astrouxds/react'
import { RuxTable, RuxTableHeader, RuxTableHeaderRow, RuxTableHeaderCell, RuxTableBody, RuxTableRow , RuxTableCell } from '@astrouxds/react'
import EditParticipant from '../components/EditParticipant.js'
import AddParticipant from '../components/AddParticipant.js'

import React, { useContext, useState, useEffect } from 'react'
import { StateContext } from '../App.js'
import './styles/Teams.css'
import keycloak from '../keycloak'

const Teams = () => {
  const { user, teams, setTeams, currentEvent, users, setUsers, serverURL, fetchEvents, fetchUserInfo } = useContext(StateContext)
  const [addingUser, setAddingUser] = useState(false)
  const [editUser, setEditUser] = useState(null)

  useEffect(async () => {
    const teams = await getTeamsData()
    await getUsersData(teams)    
  }, [])

  const getTeamsData = async () => {
    await setTeams(null)
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
    await setUsers([])
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
              setUsers(newUsers)
            })
            .catch(err => console.log(err))
    })
  }

  const refreshComponent = async () =>{
    let currentUser = user ?? await fetchUserInfo()
    await fetchEvents(currentUser)
    const teams = await getTeamsData()
    await getUsersData(teams)  
  }

  const determinePermissionLevel = (user) =>{
    if(user.is_admin === true){
      return 'Admin'
    } else if(user.is_editor === true){
      return 'Editor'
    } else {
      return 'Participant'
    }
  }

  const submitNewTeam = (event) =>{
    event.preventDefault()

    let addNewTeam = {
      name:event.target.team_name.value
    }

    let request = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${keycloak.token}`,
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(addNewTeam)
    }

    fetch(`http://localhost:3001/api/offices/${user.office_id}/events/${currentEvent.id}/teams`, request)
    .then(response => response.json())
    .then(data => refreshComponent())
    .catch(err => console.log(err))
  }

  return (
    teams && users ? 
      <div className='teams'>
        {/* for every team, there must be a tab, a panel for the tab, and a table for each panel */}

        <RuxTabs id="tab-set-teams" small="true">
        {/* This is a dynamic a tab */}
          {teams.map(team => <RuxTab id={`tab-id-${team.id}`} key={`tab-id-${team.id}`}>{team.name} </RuxTab>)}
          <RuxTab id="tab-add-team"> + </RuxTab>
        </RuxTabs>

        
        {/* for every team, there must be a tab, a panel for the tab, and a table for each panel */}
        <RuxTabPanels aria-labelledby="tab-set-teams">
        {teams.map((team) =>
          <RuxTabPanel aria-labelledby={`tab-id-${team.id}`} key={`tab-id-${team.id}`}>
            <RuxButton size='medium' className='addParticipantButton'
            onClick={() => 
              {
                if(user.is_admin){
                  setAddingUser(true)
                }
              }
            }>
              Add participant
            </RuxButton>
            <EditParticipant user={editUser} refresh={refreshComponent} />
            <AddParticipant user={user} addingUser={addingUser} team={team} refresh={refreshComponent} />
            <RuxTable>
                <RuxTableHeader>
                  <RuxTableHeaderRow>
                    <RuxTableHeaderCell> First Name </RuxTableHeaderCell>
                    <RuxTableHeaderCell> Last Name </RuxTableHeaderCell>
                    <RuxTableHeaderCell> Role </RuxTableHeaderCell>
                    <RuxTableHeaderCell> Email </RuxTableHeaderCell>
                    <RuxTableHeaderCell> Permissions </RuxTableHeaderCell>
                    <RuxTableHeaderCell></RuxTableHeaderCell>
                  </RuxTableHeaderRow>
                </RuxTableHeader>
                  <RuxTableBody>
                    {users?.map((user) => {
                      if(user.team_id === team.id){
                        return(
                          <RuxTableRow >
                            <RuxTableCell> {user.first_name ?? 'N/A'} </RuxTableCell>
                            <RuxTableCell> {user.last_name ?? 'N/A'} </RuxTableCell>
                            <RuxTableCell> {user.role} </RuxTableCell>
                            <RuxTableCell> {user.email} </RuxTableCell>
                            <RuxTableCell> {determinePermissionLevel(user)} </RuxTableCell>
                            <RuxTableCell> <img className='svg' src='/pencil-solid.svg' alt='edit' title='edit user' onClick={() => setEditUser(user)}/> </RuxTableCell>
                         </RuxTableRow>
                        )
                      }
                    })}
                </RuxTableBody>
            </RuxTable>
          </RuxTabPanel>
          )}
          <RuxTabPanel aria-labelledby="tab-add-team" key="tab-add-team">
            <h2>Create a new team!</h2>
            <form onSubmit={e => submitNewTeam(e)}>
              <label>
                Team Name:
                <input type="text" name="team-name" id='team_name'/>
              </label>
              <input type="submit" value="Submit" />
            </form>
          </RuxTabPanel>
        </RuxTabPanels>
      </div>
    : 
    null
  )
}
export default Teams;