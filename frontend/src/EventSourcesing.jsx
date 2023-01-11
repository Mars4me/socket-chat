import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRef } from 'react';

const EventSourcing = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');

    useEffect(() => {
        subscribe();
    }, []);

    const subscribe = async () => {
        const eventSource = new EventSource(`http://localhost:5000/connect`);

        eventSource.onmessage = function (event) {
            const message = JSON.parse(event.data);
            setMessages((prev) => [...prev, message]);
        };
    };

    const sendMessage = async () => {
        await axios.post('http://localhost:5000/new-messages', {
            message: value,
            id: Date.now(),
        });
    };

    return (
        <div className="center">
            <div>
                <form className="form" onSubmit={() => sendMessage}>
                    <input value={value} onChange={(e) => setValue(e.target.value)} type="text" />
                    <button type="submit">Отправить</button>
                </form>
                <div className="messages">
                    {messages.map((mess) => (
                        <div className="message" key={mess.id}>
                            {mess.message}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EventSourcing;
