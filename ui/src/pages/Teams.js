import { RuxTabs, RuxTab, RuxTabPanels, RuxTabPanel, RuxModal, RuxButton, RuxInput } from '@astrouxds/react'
import { RuxTable, RuxTableHeader, RuxTableHeaderRow, RuxTableHeaderCell, RuxTableBody, RuxTableRow , RuxTableCell } from '@astrouxds/react'
import EditParticipant from '../components/EditParticipant.js'
import AddParticipant from '../components/AddParticipant.js'

import React, { useContext, useState, useEffect } from 'react'
import { StateContext } from '../App.js'
import './styles/Teams.css'
import keycloak from '../keycloak'

const Teams = () => {
  const { user, teams, setTeams, currentEvent, users, setUsers, serverURL, fetchEvents, fetchUserInfo, currentOffice } = useContext(StateContext)
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
    // below grabs all the teams for this particular event
    let teams = await fetch(`${serverURL}/api/offices/${currentOffice.id}/events/${currentEvent.id}/teams`, request)
            .then(response => response.json())
            .then(data => {
              console.log(data)
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
      await fetch(`${serverURL}/api/offices/${currentOffice.id}/events/${currentEvent.id}/teams/${team.id}/users`, request)
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
    setAddingUser(false)
    setEditUser(null)
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

    fetch(`http://localhost:3001/api/offices/${currentOffice.id}/events/${currentEvent.id}/teams`, request)
    .then(response => response.json())
    .then(data => refreshComponent())
    .catch(err => console.log(err))
  }

  const closeComponents = (event) =>{
    event.preventDefault()

    if(user.is_admin){
      if(addingUser === true || editUser !== null){
        setAddingUser(false)
        setEditUser(null)
      }
    }
  }

  const renderSubComponents = (team) =>{
    if(addingUser){
      editUser != null ? setEditUser(null) : null;
      return <AddParticipant team={team} refresh={refreshComponent} setAddingUser={setAddingUser} setEditUser={setEditUser} />
    } else if(editUser != null){
      addingUser ? setAddingUser(false) : null;
      return <EditParticipant user={editUser} refresh={refreshComponent} setEditUser={setEditUser} setAddingUser={setAddingUser} />
    } else{
      return null;
    }
  }

  return (
      teams && users ?
        <div className='teams'>
          {/* for every team, there must be a tab, a panel for the tab, and a table for each panel */}

          <RuxTabs id="tab-set-teams" small="true">
          {/* This is a dynamic a tab */}
            {teams.map(team => <RuxTab id={`tab-id-${team.id}`} key={`tab-id-${team.id}`} onClick={(e) => closeComponents(e)}>{team.name} </RuxTab>)}
            <RuxTab id="tab-add-team"> + </RuxTab>
          </RuxTabs>


          {/* for every team, there must be a tab, a panel for the tab, and a table for each panel */}
          <RuxTabPanels aria-labelledby="tab-set-teams">
          {teams.map((team) =>
            <RuxTabPanel aria-labelledby={`tab-id-${team.id}`} key={`tab-id-${team.id}`}>
              <div className='panel'>
                {currentOffice.is_admin ?
                  <div className='button-container'>
                    <RuxButton size='medium' className='addParticipantButton' onClick={() => {
                        editUser != null ? setEditUser(null) : null;
                        setAddingUser(true)
                      }}>
                      Add participant
                    </RuxButton>
                  </div>

                    :
                    null
                  }
                {renderSubComponents(team)}
                <div className='table'>
                  <RuxTable>
                      <RuxTableHeader>
                        <RuxTableHeaderRow>
                          <RuxTableHeaderCell> First Name </RuxTableHeaderCell>
                          <RuxTableHeaderCell> Last Name </RuxTableHeaderCell>
                          <RuxTableHeaderCell> Role </RuxTableHeaderCell>
                          <RuxTableHeaderCell> Email </RuxTableHeaderCell>
                          <RuxTableHeaderCell> Permissions </RuxTableHeaderCell>
                          {currentOffice.is_admin ?
                            <RuxTableHeaderCell></RuxTableHeaderCell>
                            :
                            null
                          }
                        </RuxTableHeaderRow>
                      </RuxTableHeader>
                        <RuxTableBody>
                          {users?.map((currUser) => {
                            if(currUser.team_id === team.id){
                              return(
                                <RuxTableRow key={currUser.email}>
                                  <RuxTableCell> {currUser.first_name ?? 'N/A'} </RuxTableCell>
                                  <RuxTableCell> {currUser.last_name ?? 'N/A'} </RuxTableCell>
                                  <RuxTableCell> {currUser.role} </RuxTableCell>
                                  <RuxTableCell> {currUser.email} </RuxTableCell>
                                  <RuxTableCell> {determinePermissionLevel(currUser)} </RuxTableCell>
                                  {currentOffice.is_admin ?
                                    <RuxTableCell> <img className='edit' src='/pencil-solid.svg' alt='edit' title='edit user'
                                      onClick={() => {
                                        addingUser ? setAddingUser(false) : null;
                                        setEditUser(currUser)
                                        }}/> </RuxTableCell>
                                    :
                                    null
                                  }
                              </RuxTableRow>
                              )
                            }
                          })}
                      </RuxTableBody>
                  </RuxTable>
                </div>
              </div>
            </RuxTabPanel>
            )}
            <RuxTabPanel aria-labelledby="tab-add-team" key="tab-add-team">
              <div className='add-team-wrapper'>
                <div className='add-team'>
                  <h2>Create a new team!</h2>
                  <form onSubmit={e => submitNewTeam(e)} className='add-team-form'>
                    <div className='add-team-label'>
                      Team Name
                    </div>
                    <input className='edit-number' type="text" name="team-name" id='team_name'/>
                    <input className='button submit-new-team' type="submit" value="Create New Team" />
                  </form>
                </div>
              </div>
            </RuxTabPanel>
          </RuxTabPanels>
        </div>
      :
      null
  )
}
export default Teams;