import React from 'react'

import './index.css'

import Form from './components/Form'
import Users from './components/Users'

import { useState } from 'react'

function App() {

  const [newUser, setNewUser] = useState(null)

  const handleNewUser = (user) => {
    setNewUser(user)
  }

  return (
    <div className='app'>
      <Form onNewUser={handleNewUser}/>
      <Users onNewUser={newUser}/>
    </div>
  )
}

export default App
