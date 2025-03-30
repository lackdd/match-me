import './chats.scss'
import {Link} from 'react-router-dom';
import Chat from "./Chat";
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
	const { tokenValue, userId, webSocketClient, broadcastStatus } = useAuth();
	const [connections, setConnections] = useState([]);
	const [connectionDetails, setConnectionDetails] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [selectedUserId, setSelectedUserId] = useState(null);
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [userStatuses, setUserStatuses] = useState({});
	const [username, setUsername] = useState("");

	// Fetch user info and subscribe to status updates
	useEffect(() => {
		if (tokenValue && webSocketClient) {
			const fetchUsername = async () => {
				try {
					const response = await axios.get(`${VITE_BACKEND_URL}/api/me`, {
						headers: { Authorization: `Bearer ${tokenValue}` },
					});
					setUsername(response.data.username);

					// Set up subscription for status updates
					if (webSocketClient && webSocketClient.connected) {
						const normalizedUsername = response.data.username.trim().replace(/\s+/g, "_");

						// Subscribe to status updates for all connections
						webSocketClient.subscribe(`/user/${normalizedUsername}/queue/status`, (statusMsg) => {
							const status = JSON.parse(statusMsg.body);
							console.log("Status update received in Chats:", status);

							setUserStatuses(prev => ({
								...prev,
								[status.userId]: status.status
							}));
						});

						console.log("Subscribed to status updates in Chats component");
					}
				} catch (error) {
					console.log(error.message);
				}
			};
			fetchUsername();
		}
	}, [tokenValue, webSocketClient]);

	// fetch all connections by ids
	useEffect(() => {
		const fetchConnections = async () => {
			try {
				const response = await axios.get(`${VITE_BACKEND_URL}/api/connections`, {
					headers: {Authorization: `Bearer ${tokenValue}`},
				});
				console.log("Setting connections:", response.data);
				setConnections(response.data);

				// Get user details for all connections
				if (response.data.length > 0) {
					const userDetailsResponse = await axios.post(`${VITE_BACKEND_URL}/api/getUsersByIds`,
						response.data,
						{
							headers: { Authorization: `Bearer ${tokenValue}` },
						}
					);
					setConnectionDetails(userDetailsResponse.data);

					// Initialize status for all connections - default to INACTIVE
					const initialStatuses = {};
					response.data.forEach(connectionId => {
						initialStatuses[connectionId] = 'INACTIVE';
					});
					setUserStatuses(initialStatuses);

					// Explicitly request status updates for all connections
					if (webSocketClient && webSocketClient.connected) {
						response.data.forEach(connectionId => {
							webSocketClient.publish({
								destination: "/app/status/request",
								body: JSON.stringify({
									receiverId: connectionId
								}),
							});
							console.log(`Requested status update from user ${connectionId}`);
						});
					}
				}
			} catch (error) {
				setError(true);
				setErrorMessage(error.message);
				console.log(error.message);
			} finally {
				setLoading(false);
			}
		}

		if (tokenValue) {
			fetchConnections();

			// Also, send our ACTIVE status to all connections when the chat page loads
			if (webSocketClient && webSocketClient.connected && userId) {
				broadcastStatus(webSocketClient, userId, "ACTIVE", tokenValue);
			}
		}
	}, [tokenValue, userId, webSocketClient]);

	const handleButtonClick = (userId, username) => {
		const inputMessage = document.getElementById('message-input');

		if (inputMessage) {
			inputMessage.focus();
		}

		// Update active status for the selected user
		if (webSocketClient && webSocketClient.connected) {
			// Set previously selected user to INACTIVE
			if (selectedUserId && selectedUserId !== userId) {
				webSocketClient.publish({
					destination: "/app/status",
					body: JSON.stringify({
						receiverId: selectedUserId,
						status: "INACTIVE"
					}),
				});
			}

			// Set new selected user to ACTIVE
			webSocketClient.publish({
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
			console.log("chat or connections not found");
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

		if (!status || status === 'INACTIVE') {
			return <div className="status-dot offline" title="Offline"></div>;
		}

		if (status === 'TYPING') {
			return <div className="status-dot typing" title="Typing..."></div>;
		}

		if (status === 'ACTIVE') {
			return <div className="status-dot online" title="Online"></div>;
		}

		return <div className="status-dot offline" title="Offline"></div>;
	};

	// Periodically refresh status to ensure accuracy
	useEffect(() => {
		const statusRefreshInterval = setInterval(() => {
			if (webSocketClient && webSocketClient.connected && connections.length > 0) {
				// Request status updates for all connections
				connections.forEach(connectionId => {
					webSocketClient.publish({
						destination: "/app/status/request",
						body: JSON.stringify({
							receiverId: connectionId
						}),
					});
				});

				// Also broadcast our own status
				if (userId) {
					broadcastStatus(webSocketClient, userId, "ACTIVE", tokenValue);
				}
			}
		}, 30000); // Every 30 seconds

		return () => clearInterval(statusRefreshInterval);
	}, [webSocketClient, connections, userId, tokenValue]);

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
