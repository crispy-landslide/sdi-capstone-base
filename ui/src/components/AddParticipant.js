import React, { useContext, useEffect } from 'react'
import { StateContext } from '../App.js'
// import './styles/Teams.css'
import keycloak from '../keycloak'
import '../pages/styles/Teams.css'

const AddParticipant = ({team, refresh, setAddingUser, setEditUser}) => {
  const state = useContext(StateContext)

  const submitNewParticipant = async (event, teamId) => {
    event.preventDefault()

    let is_admin;
    let is_editor;

    if(event.target.permission_select.value === "editor"){
      is_admin = false;
      is_editor = true;
    } else if(event.target.permission_select.value === "admin"){
      is_admin = true;
      is_editor = false;
    } else{
      is_admin = false;
      is_editor = false;
    }

    let addNewParticipant = {
      first_name: event.target.first_name.value,
      last_name: event.target.last_name.value,
      email: event.target.email.value,
      role: event.target.role.value,
      is_admin: is_admin,
      is_editor: is_editor
    }

    let request = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${keycloak.token}`,
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(addNewParticipant)
    }

    await fetch(`${state.serverURL}/api/offices/${state.currentOffice.id}/events/${state.currentEvent.id}/teams/${teamId}/add-user`, request)
      .then(response => response.json())
      .then(data => data)
      .catch(err => console.log(err))
    await refresh()
    state.setCurrentTeam(state.teams.filter(team => team.id === team_id)[0])
  }

  return(
    <div className='formContainer-wrapper'>
      <div className='formContainer'>
        <div className='formHeader'>
          <img className='close' src='/x-solid.svg' alt='close' onClick={() => setAddingUser(false)} title='close component'/>
          <h2>Add new participant</h2>
          <div></div>
        </div>
        <form className='form' onSubmit={e => submitNewParticipant(e, team.id)}>
          <label>
            First Name:
            <div className='inputs'><input className='edit-number' type="text" name="first_name" id='first_name' required /></div>
          </label>
          <label>
            Last Name:
            <div className='inputs'><input className='edit-number' type="text" name="last_name" id='last_name' required /></div>
          </label>
          <label>
            Email:
            <div className='inputs'><input className='edit-number' type="text" name="email" id='email' required /></div>
          </label>
          <label>
            Role:
            <div className='inputs'><input className='edit-number' type="text" name="role" id='role' required/></div>
          </label>
          <label className="permission-title" htmlFor="permission_select">Permission Level:</label>
          <div className='inputs'>
            <select  className='edit-number' name="permissions" id="permission_select">
                  <option value="participant">Participant</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
            </select>
          </div>
          <div className='buttons'>
            <input className='button' type="submit" value="Submit" />
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddParticipant;