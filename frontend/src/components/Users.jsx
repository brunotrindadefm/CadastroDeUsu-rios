import React from 'react'

import './Users.scss'

import { FaEdit, FaRegSave } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

import { useState, useEffect } from 'react'
import axios from 'axios'
import Message from './Message';

const Users = ({ onNewUser }) => {

    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [editingUser, setEditingUser] = useState('');

    const getUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/users')
            setUsers(response.data)
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data);
                setMessage('')
            } else {
                setMessage('Erro desconhecido');
            }
        }
    };

    const handleDeleteUser = async (userID) => {
        try {
            const response = await axios.delete(`http://localhost:8000/users/${userID}`)
            setMessage(response.data)
            setUsers(users.filter((user) => user.id !== userID));
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data);
            } else {
                setMessage('Erro desconhecido');
            }
        }
    };

    const handleEditUser = async (user) => {
        setEditingUser(user);
    };

    const handleSaveUser = async (e, updatedUser) => {
        e.preventDefault();
        try {

            const userCorrection = {
                ...updatedUser,
                name: correction(updatedUser.name),
                lastName: correction(updatedUser.lastName),
                profession: correction(updatedUser.profession),
                age: Number(updatedUser.age)
            };

            const response = await axios.put(`http://localhost:8000/users/${userCorrection.id}`, userCorrection)
            const userIndex = users.findIndex((user) => user.id === userCorrection.id)
            setMessage(response.data)
            if (userIndex !== -1) {
                const newUsers = [...users];
                newUsers[userIndex] = userCorrection;
                setUsers(newUsers)
                setEditingUser(null)
            }
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data);
            } else {
                setMessage('Erro desconhecido');
            }
        }
    };

    const correction = (str) => {
       return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    useEffect(() => {
        getUsers();
    }, [onNewUser]);

    return (
        <>
            {users.length > 0 && (
                <div className='users'>
                    <>
                        {users.map((user) => (
                            <div className='user' key={user.id}>
                                <div>
                                    <p>Nome</p>
                                    <span>{user.name}</span>
                                </div>
                                <div>
                                    <p>Sobrenome</p>
                                    <span>{user.lastName}</span>
                                </div>
                                <div>
                                    <p>Profissão</p>
                                    <span>{user.profession} </span>
                                </div>
                                <div>
                                    <p>Idade</p>
                                    <span>{user.age}</span>
                                </div>
                                <div className='edit-del'>
                                    <p><FaEdit onClick={() => handleEditUser(user)} /></p>
                                    <p><MdDeleteForever onClick={() => handleDeleteUser(user.id)} /></p>
                                </div>
                                {editingUser && editingUser.id === user.id && (
                                    <form onSubmit={(e) => handleSaveUser(e, editingUser)} className='editing'>
                                        <div>
                                            <input
                                                type="text"
                                                value={editingUser.name}
                                                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                value={editingUser.lastName}
                                                onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                value={editingUser.profession}
                                                onChange={(e) => setEditingUser({ ...editingUser, profession: e.target.value })}
                                            />
                                            <input
                                                type="number"
                                                value={editingUser.age}
                                                onChange={(e) => setEditingUser({ ...editingUser, age: e.target.value })}
                                            />
                                            <button type='submit'><FaRegSave /></button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        ))}
                    </>
                </div>
            )}
            {message && <Message message={message} onClose={() => setMessage('')} />}
        </>
    )
}

export default Users
