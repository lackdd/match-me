import './connections.scss'

// react icons
import { FaRegCircleStop } from "react-icons/fa6";
import { FaRegCirclePlay } from "react-icons/fa6";
import { BsChat } from "react-icons/bs";
import React, {useCallback, useEffect, useRef, useState} from 'react';
import axios from 'axios';


function Connections() {
	const [loading, setLoading] = useState(true);
	const [currentConnectionIds, setCurrentConnectionIds] = useState([]);
	const [currentConnections, setCurrentConnections] = useState([]);
	const [pendingConnectionIds, setPendingConnectionIds] = useState([]);
	const [pendingConnections, setPendingConnections] = useState([]);
	const [isDeleting, setIsDeleting] = useState(false);
	const [pendingOrCurrent, setPendingOrCurrent] = useState("current");
	const [currentDataFetched, setCurrentDataFetched] = useState(false);
	const [pendingDataFetched, setPendingDataFetched] = useState(false);

	const token = useRef(sessionStorage.getItem("token"));
	// console.log("Token: ", token.current)

	const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


	const toggleButton = useCallback((event) => {
		// add .active class to the button and remove .active class from the other button
		const buttons = document.querySelectorAll('.current-pending-buttons-container button');
		buttons.forEach(button => {
			if (button === event.target) {
				button.classList.add('active');
			} else {
				button.classList.remove('active');
			}
		});
	}, []);


	const getProfile = async() => {
		const controller = new AbortController();
		const signal = controller.signal;

		// make a new route to access another users profile

		// fetch /users/{id} and /users/{id}/profile for the data and then display it
		// try {
		// 	const response = await axios.get(`${VITE_BACKEND_URL}/api/`)
		// }

	}
	// delete connection
	const deleteConnection = async(setState, connectionId) => { // connectionId, setConnections, setConnectionsIds
		// setIsDeleting(true);

		try {
			// Remove the connection from the state
			setState((prevConnections) =>
				prevConnections.filter((connection) => connection.id !== connectionId)
			);
		} catch (error) {
			console.error("Error deleting connection:", error);
		}

		// setCurrentConnections(prev => prev.filter(conn => conn.id !== connectionId));
		// setCurrentConnectionIds(prevIds => prevIds.filter(id => id !== connectionId));

		// try {
		// 	// todo need api for this
		// 	await axios.delete(`${VITE_BACKEND_URL}/api/connection/delete/${connectionId}`), {
		// 		headers: { "Authorization": `Bearer ${token.current}`,
		// 			"Content-Type": "application/json"},
		// 	}
		// 	setConnections(prev => prev.filter(conn => conn._id !== connectionId));
		// 	setConnectionsIds(prevIds => prevIds.filter(id => id !== connectionId))
		// } catch (error) {
		// 	if (error.response) {
		// 		console.error("Backend error:", error.response.data); // Server responded with an error
		// 	} else {
		// 		console.error("Request failed:", error.message); // Network error or request issue
		// 	}
		// } finally {
		// 	setIsDeleting(false);
		// }


	}


	// fetch connection ids
	const getConnectionIds = async() => {
		const controller = new AbortController(); // Create an abort controller
		const signal = controller.signal;

		try {
			const [currentConnectionsResponse, pendingConnectionsResponse] = await Promise.all([
				axios.get(`${VITE_BACKEND_URL}/api/connections`, {
					headers: { "Authorization": `Bearer ${token.current}`,
						"Content-Type": "application/json"},
					signal,
				}),
				axios.get(`${VITE_BACKEND_URL}/api/pendingRequests`, {
					headers: { "Authorization": `Bearer ${token.current}`,
						"Content-Type": "application/json"},
					signal,
				}),
			])

			const currentIds = currentConnectionsResponse.data;
			const pendingIds = pendingConnectionsResponse.data;

			await getConnectionsData(currentIds, setCurrentConnections, setCurrentDataFetched);
			await getConnectionsData(pendingIds, setPendingConnections, setPendingDataFetched);

		} catch (error) {
			if (axios.isCancel(error)) {
				console.log("Fetch aborted");
			} else {
				console.error("Error getting connections: ", (error.message))
				// todo display error to user
			}
		}
	}

	// fetch data based on ids
	const getConnectionsData = async(ids, setState, setFetchedState) => {
		const controller = new AbortController(); // Create an abort controller
		const signal = controller.signal;

		try {
			const requests = ids.map(id =>
				axios.get(`${VITE_BACKEND_URL}/api/users/${id}`, {
					headers: { "Authorization": `Bearer ${token.current}`,
						"Content-Type": "application/json"},
					signal,
				})
			);
			const responses = await Promise.all(requests);
			const users = responses.map(response => response.data); // Extract user data

			setState(users);
			setFetchedState(true); // Indicate that data has been fetched

		} catch (error) {
			if (axios.isCancel(error)) {
				console.log("Fetch aborted");
			} else {
				if (error.response) {
					console.error("Backend error:", error.response.data); // Server responded with an error
				} else {
					console.error("Request failed:", error.message); // Network error or request issue
				}
				// todo display error to user
			}
		}
	}

	// display current connections
	const displayConnections = (connections) => {
		if (connections.length === 0) {

			if (connections === currentConnections && pendingOrCurrent === "current") {
				return (
					<div className='no-connections-message'>No connections yet</div>
				)
			}

			if (connections === pendingConnections && pendingOrCurrent === "pending") {
				return (
					<div className='no-connections-message'>No requests yet</div>
				)
			}

		}

		return connections.map((connection, index) => (
			<div key={index} id={connection.id} className='connection'>

				<div className='picture-name-container'>
					<img src='profile_pic_female.jpg' alt=''/>
					{/*<img src={connection.profilePicture} alt={connection.username} className='connection-pic' />*/}
					<div className='name'>{connection.username}</div>
				</div>

				{connections === currentConnections && (
					<div className='connections-buttons-container'>
						<button className='no' onClick={(event) => deleteConnection(setCurrentConnections, connection.id)}><FaRegCircleStop /></button>
						<button className='chat'><BsChat /></button>
					</div>
				)}

				{connections === pendingConnections && (
					<div className='connections-buttons-container'>
						<button className='no' onClick={(event) => deleteConnection(setPendingConnections, connection.id)}><FaRegCircleStop /></button>
						<button className='yes'><FaRegCirclePlay /></button>
					</div>
				)}

			</div>
		))
	}

	// fetch current and pending connection ids
	useEffect(() => {
		getConnectionIds();
	}, []);

	// change loading state when all data is fetched
	useEffect(() => {
		if (currentDataFetched && pendingDataFetched) {
			setLoading(false);
		}
	}, [currentDataFetched, pendingDataFetched]);


	// log current connections
	useEffect(() => {
		console.log("Current connections: ", currentConnections);
		console.log("Pending connections: ", pendingConnections);
	}, [currentConnections]);


	return (
		<div className='connections-container'>

			{loading && (
				<div className={'spinner-container'}>
					<div className='spinner endless'>Finding friends...</div>
				</div>
			)}

			{!loading && (
				<div className='extra-connections-container'>

					<div className='current-pending-buttons-container'>

						<button className='current active' onClick={() => {
							toggleButton(event);
							setPendingOrCurrent('current');
						}}>Current connections</button>

						<button className='pending' onClick={() => {
							toggleButton(event);
							setPendingOrCurrent('pending');
						}}>Pending connections</button>

					</div>


					<div className='connections-list'>

						{pendingOrCurrent === 'current' && displayConnections(currentConnections)}

						{pendingOrCurrent === 'pending' && displayConnections(pendingConnections)}

					</div>
				</div>
			)}
		</div>
	);
}

export default Connections;

