import React from 'react'

import { useEffect, useState } from 'react';

import './Message.scss'

const Message = ({message, onClose}) => {

    const [type, setType] = useState('')

    useEffect(() => {
        if (message) {
            if (message.includes('sucesso')) {
                setType('success');
            } else if (message.includes('Erro')) {
                setType('error');
            } else {
                setType(''); 
            }
        }

        const timer = setTimeout(() => {
            onClose();
        }, 3000); 
        return () => clearTimeout(timer);
    }, [message, onClose]);

    if (!message) return null;

    return (
        <div className={`notification ${type}`}>
            {message}
        </div>
    );
};

export default Message
