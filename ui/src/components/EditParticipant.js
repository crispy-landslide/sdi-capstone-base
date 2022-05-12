import React, { useContext, useState, useEffect } from 'react'
import { StateContext } from '../App.js'
// import './styles/Teams.css'
import keycloak from '../keycloak'

import { RuxButton } from '@astrouxds/react'

const EditParticipant = ({user, refresh}) => {
  const { currentEvent } = useContext(StateContext)

  const patchParticipant = (event, user) => {
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

    let editedParticipant = {
      email: user.email,
      role: event.target.role.value,
      is_admin: is_admin,
      is_editor: is_editor
    }

    let request = {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${keycloak.token}`,
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(editedParticipant)
    }

    fetch(`http://localhost:3001/api/offices/${user.office_id}/events/${currentEvent.id}/teams/${user.team_id}/edit-user`, request)
    .then(response => response.json())
    .then(data => refresh())
    .catch(err => console.log(err))
  }

  const removeParticipant = (event, user) => {
    event.preventDefault()

    let editedParticipant = {
      email: user.email
    }

    let request = {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${keycloak.token}`,
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(editedParticipant)
    }

    fetch(`http://localhost:3001/api/offices/${user.office_id}/events/${currentEvent.id}/teams/${user.team_id}/remove-user`, request)
    .then(response => response.json())
    .then(data => refresh())
    .catch(err => console.log(err))
  }

  return(
    user !== null ? 
      <div className='formContainer'>
        <h2 className='formHeader'>Editing a participant:</h2>
        <form className='form' onSubmit={e => patchParticipant(e, user)}>
          <p>First Name: {user.first_name}</p>
          <p>Last Name: {user.last_name}</p>
          <label>
            Role:
            <input type="text" name="role" id='role'/>
          </label>
          <p>Email: {user.email}</p>
          <label htmlFor="permission_select">Permission Level:</label>
            <select name="permissions" id="permission_select">
                <option value="participant">Participant</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
            </select>
          <input type="submit" value="Submit" />
        </form>
        <RuxButton size='medium' className='removeParticipantButton' onClick={(e) => removeParticipant(e, user)}> Remove participant </RuxButton>
      </div>
    :
    null
  )
}

export default EditParticipant;