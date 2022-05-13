import React, { useContext, useState, useEffect } from 'react'
import { StateContext } from '../App.js'
import keycloak from '../keycloak'
import '../pages/styles/Teams.css'

import { RuxButton } from '@astrouxds/react'

const EditParticipant = ({user, refresh, setEditUser, setAddingUser}) => {
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

    if (window.confirm('Are you sure you want to remove this participant?')) {
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
  }

  return( 
      <div className='formContainer-wrapper'>
        <div className='formContainer'>
          <div className='formHeader'>
            <img className='close' src='/x-solid.svg' alt='close' onClick={() => setEditUser(null)} title='close component'/>
            <h2>Edit a participant!</h2>
            <img className='trash' src='/trash-solid.svg' alt='delete' onClick={(e) => removeParticipant(e, user)} title='delete attack'/>
          </div>
          <form className='form' onSubmit={e => patchParticipant(e, user)}>
            <p>First Name: {user.first_name ?? 'N/A'}</p>
            <p>Last Name: {user.last_name ?? 'N/A'}</p>
            <label>
              Role:
              <div className='inputs'> <input type="text" name="role" id='role' required /> </div>
            </label>
            <p>Email: {user.email}</p>
            <label className="permission-title" htmlFor="permission_select">Permission Level:</label>
            <div className='inputs'>
              <select name="permissions" id="permission_select">
                  <option value="participant">Participant</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
              </select>
            </div>
            <div className='buttons'>
              <input type="submit" value="Submit" />
            </div>
          </form>
        </div>
      </div>
  )
}

export default EditParticipant;