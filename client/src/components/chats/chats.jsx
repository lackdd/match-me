import './chats.scss'
import {Link} from 'react-router-dom';
import Chat from "../chats/Chat";
/*import {useAuth} from '../../AuthContext.jsx';*/
import { useAuth } from '../utils/AuthContext.jsx';
import React, {useEffect, useState} from "react";
import axios from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// react icons
import { IoArrowBack } from "react-icons/io5";
import { IoArrowForward } from "react-icons/io5";

function Chats() {
	const [loading, setLoading] = useState(true);
	const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
	const { tokenValue } = useAuth();
	const [connections, setConnections] = useState([]);
	const [connectionDetails, setConnectionDetails] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [selectedUserId, setSelectedUserId] = useState(null);
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [userStatuses, setUserStatuses] = useState({});
	const [client, setClient] = useState(null);
	const [username, setUsername] = useState("");

	// Fetch user info and establish WebSocket connection
	useEffect(() => {
		if (tokenValue) {
			const fetchUsername = async () => {
				try {
					const response = await axios.get(`${VITE_BACKEND_URL}/api/me`, {
						headers: { Authorization: `Bearer ${tokenValue}` },
					});
					setUsername(response.data.username);

					// Set up WebSocket connection once we have the username
					const normalizedUsername = response.data.username.trim().replace(/\s+/g, "_");
					const socket = new SockJS("/ws");
					const stompClient = new Client({
						webSocketFactory: () => socket,
						connectHeaders: {
							Authorization: `Bearer ${tokenValue}`,
						},
						reconnectDelay: 5000,
						onConnect: () => {
							console.log("Connected to WebSocket in Chats component");

							// Subscribe to status updates for all connections
							stompClient.subscribe(`/user/${normalizedUsername}/queue/status`, (statusMsg) => {
								const status = JSON.parse(statusMsg.body);
								console.log("Status update received:", status);

								setUserStatuses(prev => ({
									...prev,
									[status.userId]: status.status
								}));
							});
						}
					});

					stompClient.activate();
					setClient(stompClient);
				} catch (error) {
					console.log(error.message);
				}
			};
			fetchUsername();

			return () => {
				if (client) {
					client.deactivate();
				}
			};
		}
	}, [tokenValue]);

	// fetch all connections by ids
	// todo sort connections by latest message
	useEffect(() => {
		const fetchConnections = async () => {
			try {
				const response = await axios.get(`${VITE_BACKEND_URL}/api/connections`, {
					headers: {Authorization: `Bearer ${tokenValue}`},
				});
				console.log("Setting connections:", response.data);
				setConnections(response.data);

				// todo get profile pictures as well
				if (response.data.length > 0) {
					const userDetailsResponse = await axios.post(`${VITE_BACKEND_URL}/api/getUsersByIds`,
						response.data,
						{
							headers: { Authorization: `Bearer ${tokenValue}` },
						}
					);
					setConnectionDetails(userDetailsResponse.data);

					// Initialize status for all connections as INACTIVE
					const initialStatuses = {};
					response.data.forEach(userId => {
						initialStatuses[userId] = 'INACTIVE';
					});
					setUserStatuses(initialStatuses);
				}
			} catch (error) {
				setError(true);
				setErrorMessage(error.message);
				console.log(error.message);
			} finally {
				setLoading(false);
			}
		}
		fetchConnections();
	}, []);

	const handleButtonClick = (userId, username) => {
		const inputMessage = document.getElementById('message-input');

		if (inputMessage) {
			inputMessage.focus();
		}

		// Notify all connections that you're going offline for them
		if (client && connections.length > 0) {
			connections.forEach(connectionId => {
				if (connectionId !== userId) {
					client.publish({
						destination: "/app/status",
						body: JSON.stringify({
							receiverId: connectionId,
							status: "INACTIVE"
						}),
					});
				}
			});

			// Then notify the selected user you're active
			client.publish({
				destination: "/app/status",
				body: JSON.stringify({
					receiverId: userId,
					status: "ACTIVE"
				}),
			});
		}

		setSelectedUser(username);
		setSelectedUserId(userId);
	};

	const openChat = () => {
		// open chat
		const connections = document.getElementById('connections')
		const chat = document.getElementById('chat')

		if (!chat || !connections) {
			console.log("chat or connections on found");
			return;
		}

		connections.classList.remove('show-connections');
		connections.classList.add('hide-connections');
		chat.classList.remove('hide-chat');
		chat.classList.add('show-chat');
	}

	// Render status indicator for connections list
	const renderConnectionStatus = (userId) => {
		const status = userStatuses[userId];
		console.log(`Rendering status for user ${userId}: ${status}`);

		if (!status || status === undefined) {
			return <div className="status-dot offline"></div>;
		}

		if (status === 'TYPING') {
			return <div className="status-dot typing"></div>;
		}

		if (status === 'ACTIVE') {
			return <div className="status-dot online"></div>;
		}

		return <div className="status-dot offline"></div>;
	};

	// todo add online/offline indicators
	return (
		<div className='chats-container'>

			{!error ? (
				<>
					{loading && (
						<div className={'spinner-container'}>
							<div className='spinner endless'>Loading chats...</div>
						</div>
					)}

					{!loading && (
						<div className='extra-chats-container'>
							<div className='connections' id={'connections'}>
								{connectionDetails.length === 0 ? (
									<p className={'no-connections-message'}>No connections</p>
								) : (
									connectionDetails.map((connection) => (
										<button className={`picture-name-button ${selectedUserId === connection.id ? 'selected' : ''}`} key={connection.id} onClick={() => {
											handleButtonClick(connection.id, connection.username);
											openChat();
										}}>
											<div className="connection-info">
												<img src='profile_pic_female.jpg' alt='' className='profile-picture'/>
												<div className='name'>{connection.username}</div>
											</div>
											{renderConnectionStatus(connection.id)}
										</button>
									))
								)}
							</div>

							<div className='chat' id={'chat'}>
								{selectedUser ? (
									<Chat receiverUsername={selectedUser} receiverUserId={selectedUserId} />
								) : (
									<p className={'no-chat'}>Select a user to start chatting</p>
								)}
							</div>
						</div>
					)}
				</>
			) : (
				<div className='api-error'>{errorMessage}</div>
			)}
		</div>
	);
}

export default Chats;
