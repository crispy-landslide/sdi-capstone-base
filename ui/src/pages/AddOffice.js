import React, { useContext } from 'react'
import { StateContext } from '../App.js'
import './styles/AddOffice.css'
import { useKeycloak } from '@react-keycloak/web'

const AddOffice = () => {
  const state = useContext(StateContext)
  const { keycloak, initialized } = useKeycloak();

  const handleOfficeSubmit = async (e) => {
    e.preventDefault();
    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${keycloak.token}`
      },
      body: JSON.stringify({name: e.target.name.value})
    }
    const url = `${state.serverURL}/api/offices`
    const newOffice = await fetch(url, request)
      .then(response => response.json())
      .then(data => data)
      .catch(err => console.error(err))

    const userInformation = await state.fetchUserInfo();
    newOffice && state.setCurrentOffice(newOffice);


  }

  return (
    <div className='add-office'>
      <form className='add-office-form' onSubmit={handleOfficeSubmit}>
        <input className='edit-number' type='text' name='name' id='name' placeholder='Office name' required/>
        <input className='button' type='submit' value="Create office"/>
      </form>
    </div>
  )
}

export default AddOffice;