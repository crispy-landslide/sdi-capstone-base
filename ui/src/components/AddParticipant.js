import React, { useContext } from 'react'
import { StateContext } from '../App.js'
// import './styles/Teams.css'
import keycloak from '../keycloak'
import '../pages/styles/Teams.css'

const AddParticipant = ({addingUser, team, refresh}) => {
  const { user, currentEvent } = useContext(StateContext)
  const submitNewParticipant = (event, teamId) => {
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
      email:event.target.email.value,
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

    fetch(`http://localhost:3001/api/offices/${user.office_id}/events/${currentEvent.id}/teams/${teamId}/add-user`, request)
    .then(response => response.json())
    .then(data => refresh())
    .catch(err => console.log(err))
  }

  return(
    addingUser ? 
      <div className='formContainer'>
        <div><h2 className='formHeader'>Add a new participant!</h2></div>
        <form className='form' onSubmit={e => submitNewParticipant(e, team.id)}>
          <label>
            Email:
            <div><input type="email" name="email" id='email'/></div>
          </label>
          <label>
            Role:
            <div><input type="text" name="role" id='role'/></div>
          </label>
          <label htmlFor="permission_select">Permission Level:</label>
            <select name="permissions" id="permission_select">
                <option value="participant">Participant</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
            </select>
          <input type="submit" value="Submit" />
        </form>
      </div>
    :
  null
  )
}

export default AddParticipant;