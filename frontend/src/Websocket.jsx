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
        const message = {
            username,
            message: value,
            id: Date.now(),
            event: 'message',
        };
        socket.current.send(JSON.stringify(message));
        setValue('');
    };

    if (!connected) {
        return (
            <div className="center">
                <div className="form">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your name"
                    />
                    <button onClick={connect}>Enter</button>
                </div>
            </div>
        );
    }

    return (
        <div className="center">
            <div>
                <form
                    className="form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        sendMessage();
                    }}
                >
                    <p style={{ margin: '1rem auto 2rem auto', fontSize: '1rem', textTransform: 'uppercase' }}>{username}</p>
                    <input value={value} onChange={(e) => setValue(e.target.value)} type="text" />
                    <button type="submit">Отправить</button>
                </form>
                <div className="messages">
                    {messages.map((mess) => (
                        <div key={mess.id}>
                            {mess.event === 'connection' ? (
                                <div className="connection_message">User with {mess.username} connected</div>
                            ) : (
                                <div className="message">
                                    {mess.username}. {mess.message}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Websocket;
