import './chats.scss'
import {Link} from 'react-router-dom';
import Chat from "../chats/Chat";
/*import {useAuth} from '../../AuthContext.jsx';*/
import { useAuth } from '../utils/AuthContext.jsx';
import React, {useEffect, useState} from "react";
import axios from "axios";

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
											<img src='profile_pic_female.jpg' alt='' className='profile-picture'/>
											<div className='name'>{connection.username}</div>
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
