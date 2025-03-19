import React, { useState, useEffect } from "react";
import './chats.scss'
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
/*import {useAuth} from "../../AuthContext.jsx";*/
import { useAuth } from '../utils/AuthContext.jsx';
import axios from "axios";

import { IoMdSend } from "react-icons/io";
import {IoArrowBack} from 'react-icons/io5';

/*var stompClient = null;*/

const Chat = ({receiverUsername, receiverUserId}) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [client, setClient] = useState(null);
    const [userId, setUserId] = useState(null);
    /*const [privateMessage, setPrivateMessage] = useState(new Map());
    const [publicMessage, setPublicMessage] = useState([]);
    const [chatArea, setChatArea] = useState("PUBLIC");
    const [userData, setUserData] = useState({
        username: "",
        receivername: "",
        message: "",
        connected: false,
    });*/

    const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const { isUserLoggedIn, tokenValue } = useAuth();
    const [username, setUsername] = useState("");

    useEffect(() => {
        if(!receiverUserId || !userId) return;

        const fetchChatHistory = async () => {
            try {
                const response = await axios.get(`${VITE_BACKEND_URL}/api/chat/history/${receiverUserId}`, {
                    headers: {Authorization: `Bearer ${tokenValue}`},
                });
                console.log("Fetched chat history:", response.data);
                setMessages(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchChatHistory();
    }, [receiverUserId, userId]);

    useEffect(() => {
        if(isUserLoggedIn && tokenValue) {
            const fetchUsername =  async () => {
                try {
                    const response = await axios.get(`${VITE_BACKEND_URL}/api/me`,
                        {
                        headers: { Authorization: `Bearer ${tokenValue}` },
                    });
                    console.log("Logging in as:", response.data.username);
                    setUsername(response.data.username);
                    setUserId(response.data.id);
                } catch (error) {
                    console.log(error.message);
                }
            }
            fetchUsername();
        }
    }, [isUserLoggedIn, tokenValue]);

   /* const registerUser = () => {
        connect();
    };*/

   /* const connect = () => {
        let sock = new SockJS("http://localhost:8080/ws");
        stompClient = over(sock);
        stompClient.connect({}, onConnected, onError);
    };*/


    useEffect(() => {
        if (!username) return;

        // Normalize username: Remove spaces and replace them with underscores
        const normalizedUsername = username.trim().replace(/\s+/g, "_");
        console.log(`🔗 Connecting WebSocket for user: ${normalizedUsername}`);
        const socket = new SockJS("/ws"); // Use SockJS
        const stompClient = new Client({
            webSocketFactory: () => socket, // WebSocket factory to use SockJS
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("Connected to WebSocket");

                // subscribe to private messages for the logged in user
                stompClient.subscribe(`/user/${normalizedUsername}/queue/messages`, (msg) => {
                    console.log("📩 Incoming message:", msg.body);
                    setMessages((prev) => [...prev, JSON.parse(msg.body)]);
                });
            },
        });
        /*${username}*/
        /*/${normalizedUsername}*/

        stompClient.activate();
        setClient(stompClient);

        return () => {
            stompClient.deactivate();
        };
    }, [username]);

    const sendMessage = () => {
        console.log("user id:", userId);
        if (client && message.trim() && receiverUsername) {
            client.publish({
                destination: "/app/private-message",
                body: JSON.stringify({
                    senderId: userId,
                    receiverId: receiverUserId,
                    content: message
                }),
            });
            setMessage("");
        }
    };

    const handleKeyPresses = (event) => {
        const inputMessage = document.getElementById('message-input');

        if (event.key === "Tab" && inputMessage) {

            if (document.activeElement !== inputMessage) {
                inputMessage.focus();
            }
        }

        const sendButton = document.getElementById('send-message');

        // send message with "Enter" key
        if (event.key === "Enter" && sendButton) {
            sendButton.classList.add("active");

            setTimeout(() => {
                sendButton.classList.remove("active");
            }, 100);

            sendMessage();
        }
    }

    const backToConnections = () => {
        // todo navigate to connections page
        const connections = document.getElementById('connections')
        const chat = document.getElementById('chat')

        if (!chat || !connections) {
            console.log("chat or connections on found");
            return;
        }

        connections.classList.add('show-connections');
        connections.classList.remove('hide-connections');
        chat.classList.remove('show-chat');
        chat.classList.add('hide-chat');
    }

    // todo add "typing..." indicator when other user is typing
    return (
        <div className="chat-box" onKeyDown={handleKeyPresses}>
            <div className='heading-container'>
                <button className='toggle-connections' onClick={backToConnections} tabIndex={-1}><IoArrowBack /></button>
                <h2>{receiverUsername}</h2>
            </div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message-box ${msg.senderUsername === username ? "sent" : "received"}`}>
                        {msg.content}
                    </div>
                ))}
            </div>
            <div className='input-container'>
                <input
                    id={'message-input'}
                    className="input"
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button id={'send-message'} onClick={sendMessage} tabIndex={-1}><IoMdSend /></button>
            </div>
        </div>
    );
};

export default Chat;
