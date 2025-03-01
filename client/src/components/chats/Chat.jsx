import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [client, setClient] = useState(null);

    useEffect(() => {
        const socket = new SockJS("/ws"); // Use SockJS
        const stompClient = new Client({
            webSocketFactory: () => socket, // WebSocket factory to use SockJS
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("Connected to WebSocket");
                stompClient.subscribe("/topic/messages", (msg) => {
                    setMessages((prev) => [...prev, JSON.parse(msg.body)]);
                });
            },
        });

        stompClient.activate();
        setClient(stompClient);

        return () => {
            stompClient.deactivate();
        };
    }, []);

    const sendMessage = () => {
        if (client && message.trim()) {
            client.publish({
                destination: "/app/message",
                body: JSON.stringify({ sender: "User", content: message }),
            });
            setMessage("");
        }
    };

    return (
        <div>
            <h2>Chat Room</h2>
            <div style={{ border: "1px solid black", padding: "10px", height: "200px", overflowY: "auto" }}>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender}: </strong> {msg.content}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
