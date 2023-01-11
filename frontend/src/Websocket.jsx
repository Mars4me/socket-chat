import React, { useRef, useState } from 'react';

const Websocket = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const socket = useRef('');
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState('');

    function connect() {
        socket.current = new WebSocket('ws://localhost:5000');
        socket.current.onopen = () => {
            setConnected(true);
            const message = {
                event: 'connection',
                username,
                id: Date.now(),
            };
            socket.current.send(JSON.stringify(message));
            console.log('Connected');
        };

        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages((prev) => [message, ...prev]);
        };

        socket.current.onclose = () => {
            console.log('Socket closed');
        };
        socket.current.onerror = () => {
            console.log('Socket error');
        };
    }

    const sendMessage = async () => {
        if (value) {
            const message = {
                username,
                message: value,
                id: Date.now(),
                event: 'message',
            };
            socket.current.send(JSON.stringify(message));
            setValue('');
        }

    };

    if (!connected) {
        return (<>
            <h3>Log in</h3>
            <form className="form" onSubmit={e => { e.preventDefault(); connect() }}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your name"
                />
                <button type="submit">Enter</button>
            </form>
        </>
        );
    }

    return (
        <>
            <h3>Welcome {username}</h3>
            <form
                className="form"
                onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                }}
            >
                <input value={value} onChange={(e) => setValue(e.target.value)} type="text" />
                <button type="submit">Отправить</button>
            </form>
            <div className="messages">
                {messages.map((mess) => (
                    <div key={mess.id}>
                        {mess.event === 'connection' ? (
                            <div className="connection_message">User {mess.username || 'unknown'} connected</div>
                        ) : (
                            <div className="message">
                                <b style={{ color: 'rgba(255,255,255, .8)' }}>{mess.username}</b>. {mess.message}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};

export default Websocket;
