import './chats.scss'
import {Link} from 'react-router-dom';
import Chat from "../chats/Chat";
import {useAuth} from '../../AuthContext.jsx';
import {useEffect, useState} from "react";
import axios from "axios";

function Chats() {
	const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
	const { tokenValue } = useAuth();
	const [connections, setConnections] = useState([]);
	const [connectionDetails, setConnectionDetails] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [selectedUserId, setSelectedUserId] = useState(null);

	useEffect(() => {
		const fetchConnections = async () => {
			try {
				const response = await axios.get(`${VITE_BACKEND_URL}/api/connections`, {
					headers: {Authorization: `Bearer ${tokenValue}`},
				});
				console.log("Setting connections:", response.data);
				setConnections(response.data);

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
				console.log(error.message);
			}

		}
		fetchConnections();
	}, []);

	const handleButtonClick = (userId, username) => {
		setSelectedUser(username);
		setSelectedUserId(userId);
	};

	return (
		<div className='chats-container'>

			<div className='extra-chats-container'>

				<div className='connections'>
					<h3>Connections</h3>
					{connectionDetails.length === 0 ? (
						<p>No connections</p>
					) : (
						connectionDetails.map((connection) => (
					<button key={connection.id} onClick={() => handleButtonClick(connection.id, connection.username)}>
						{connection.username}
					</button>
						))
					)}
				</div>

				<div className='chat'>
					<h3>Chat</h3>
					{selectedUser ? (
						<Chat receiverUsername={selectedUser} receiverUserId={selectedUserId} />
					) : (
						<p>Select a user to start chatting</p>
					)}
				</div>

			</div>
		</div>

	);
}

export default Chats;
