import React from 'react';

import './Form.scss';

import axios from 'axios';
import { useState } from 'react';
import Message from '../Message/Message';

const Form = ({ onNewUser }) => {

    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profession, setProfession] = useState('');
    const [age, setAge] = useState('');
    const [message, setMessage] = useState('');

    const sendUsers = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/users', { name, lastName, profession, age });
            setMessage(response.data);
            onNewUser({ name, lastName, profession, age })
            setName('');
            setLastName('');
            setProfession('');
            setAge('');
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data);
              } else {
                setMessage('Erro desconhecido');
              }
        }
    }

    return (
        <>
            <div className='container'>
                <h2>Cadastro de usuários</h2>
                <form onSubmit={sendUsers} className='form'>
                    <input
                        type="text"
                        placeholder='Nome'
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        required
                    />
                    <input
                        type="text"
                        placeholder='Sobrenome'
                        onChange={(e) => setLastName(e.target.value)}
                        value={lastName}
                        required
                    />
                    <input
                        type="text"
                        placeholder='Profissão'
                        onChange={(e) => setProfession(e.target.value)}
                        value={profession}
                        required
                    />
                    <input
                        type="number"
                        placeholder='Idade'
                        onChange={(e) => setAge(e.target.value)}
                        value={age}
                        required
                    />
                    <button type='submit'>Cadastrar</button>
                </form>
            </div>
            {message && <Message message={message} onClose={() => setMessage('')} />}
        </>
    )
}

export default Form
