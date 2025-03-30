import './chats.scss'
import {Link} from 'react-router-dom';
import Chat from "./Chat";
import { useAuth } from '../utils/AuthContext.jsx';
import React, {useEffect, useState, useCallback} from "react";
import axios from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// react icons
import { IoArrowBack } from "react-icons/io5";
import { IoArrowForward } from "react-icons/io5";
import { FaBell } from "react-icons/fa";

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
	const [unreadMessages, setUnreadMessages] = useState({});
	const [totalUnreadCount, setTotalUnreadCount] = useState(0);
	const [notifications, setNotifications] = useState([]);

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

						// Subscribe to notifications for unread messages
						webSocketClient.subscribe(`/user/${normalizedUsername}/queue/notifications`, (notificationMsg) => {
							const notification = JSON.parse(notificationMsg.body);
							console.log("Notification received:", notification);

							// Update the unread messages count for this sender
							setUnreadMessages(prev => ({
								...prev,
								[notification.senderId]: notification.count
							}));

							// Update total unread count
							fetchUnreadCount();

							// Update notifications list
							fetchNotifications();
						});

						console.log("Subscribed to status updates and notifications");
					}
				} catch (error) {
					console.log(error.message);
				}
			};
			fetchUsername();
		}
	}, [tokenValue, webSocketClient]);

	// Fetch unread messages count
	const fetchUnreadCount = async () => {
		try {
			const response = await axios.get(`${VITE_BACKEND_URL}/api/chat/unread-count`, {
				headers: { Authorization: `Bearer ${tokenValue}` },
			});
			setTotalUnreadCount(response.data.count);
		} catch (error) {
			console.error("Error fetching unread count:", error);
		}
	};

	// Fetch notifications (details about unread messages)
	const fetchNotifications = async () => {
		try {
			const response = await axios.get(`${VITE_BACKEND_URL}/api/chat/notifications`, {
				headers: { Authorization: `Bearer ${tokenValue}` },
			});
			setNotifications(response.data);

			// Also update unread counts per sender
			const unreadCounts = {};
			response.data.forEach(notification => {
				unreadCounts[notification.senderId] = notification.count;
			});
			setUnreadMessages(unreadCounts);
		} catch (error) {
			console.error("Error fetching notifications:", error);
		}
	};

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
								headers: {
									Authorization: `Bearer ${tokenValue}`
								},
								body: JSON.stringify({
									receiverId: connectionId
								}),
							});
							console.log(`Requested status update from user ${connectionId}`);
						});
					}
				}

				// Fetch unread messages and notifications
				fetchUnreadCount();
				fetchNotifications();

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

	// Request status updates periodically
	useEffect(() => {
		const statusRefreshInterval = setInterval(() => {
			if (webSocketClient && webSocketClient.connected && connections.length > 0) {
				// Request status updates for all connections
				connections.forEach(connectionId => {
					webSocketClient.publish({
						destination: "/app/status/request",
						headers: {
							Authorization: `Bearer ${tokenValue}`
						},
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
					headers: {
						Authorization: `Bearer ${tokenValue}`
					},
					body: JSON.stringify({
						receiverId: selectedUserId,
						status: "INACTIVE"
					}),
				});
			}

			// Set new selected user to ACTIVE
			webSocketClient.publish({
				destination: "/app/status",
				headers: {
					Authorization: `Bearer ${tokenValue}`
				},
				body: JSON.stringify({
					receiverId: userId,
					status: "ACTIVE"
				}),
			});
		}

		setSelectedUser(username);
		setSelectedUserId(userId);

		// Messages will be marked as read in the Chat component
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

	// Render unread message count badge
	const renderUnreadBadge = (userId) => {
		const count = unreadMessages[userId];
		if (!count || count <= 0) return null;

		return (
			<div className="unread-badge" title={`${count} unread message${count > 1 ? 's' : ''}`}>
				{count > 99 ? '99+' : count}
			</div>
		);
	};

	return (
		<div className='chats-container'>
			{/* Add total unread count in the header if needed */}
			{totalUnreadCount > 0 && (
				<div className="total-unread-badge">
					<FaBell />
					<span>{totalUnreadCount}</span>
				</div>
			)}

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
											<div className="connection-indicators">
												{renderUnreadBadge(connection.id)}
												{renderConnectionStatus(connection.id)}
											</div>
										</button>
									))
								)}
							</div>

							<div className='chat' id={'chat'}>
								{selectedUser ? (
									<Chat receiverUsername={selectedUser} receiverUserId={selectedUserId} />
								) : (
									<p className={'no-chat'}>
										Select a user to start chatting
										{notifications.length > 0 && (
											<div className="unread-notifications">
												<h3>Unread Messages</h3>
												{notifications.map(notification => (
													<div
														key={notification.messageId}
														className="notification-item"
														onClick={() => {
															const user = connectionDetails.find(c => c.id === notification.senderId);
															if (user) {
																handleButtonClick(user.id, user.username);
																openChat();
															}
														}}
													>
														<div className="notification-sender">{notification.senderUsername}</div>
														<div className="notification-preview">{notification.messagePreview}</div>
														<div className="notification-count">{notification.count}</div>
													</div>
												))}
											</div>
										)}
									</p>
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

