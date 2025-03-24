import './connections.scss'
import React, {useCallback, useEffect, useRef, useState} from 'react';
import axios from 'axios';
import { useAuth } from '../utils/AuthContext.jsx';

// react icons
import { FaRegCircleStop } from "react-icons/fa6";
import { FaRegCirclePlay } from "react-icons/fa6";
import { BsChat } from "react-icons/bs";
import { FaRegCircleXmark } from "react-icons/fa6"



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
	const toDeleteId = useRef(0);
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	// const toDeleteName = useRef("");
	const [toDeleteName, setToDeleteName] = useState("");
	const { tokenValue } = useAuth();

	const modal = document.getElementById('loadingModal');
	// const token = useRef(sessionStorage.getItem("token"));
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

	// fetch connection ids
	const getConnectionIds = async() => {
		const controller = new AbortController(); // Create an abort controller
		const signal = controller.signal;

		try {
			const [currentConnectionsResponse, pendingConnectionsResponse] = await Promise.all([
				axios.get(`${VITE_BACKEND_URL}/api/connections`, {
					headers: {
						"Authorization": `Bearer ${tokenValue}`,
						"Content-Type": "application/json"},
					signal,
				}),
				axios.get(`${VITE_BACKEND_URL}/api/pendingRequests`, {
					headers: {
						"Authorization": `Bearer ${tokenValue}`,
						"Content-Type": "application/json"},
					signal,
				}),
			])

			const currentIds = currentConnectionsResponse.data || [];
			const pendingIds = pendingConnectionsResponse.data || [];

			await getConnectionsData(currentIds, setCurrentConnections, setCurrentDataFetched);
			await getConnectionsData(pendingIds, setPendingConnections, setPendingDataFetched);

		} catch (error) {
			setError(true);
			setErrorMessage(error.message);
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

		if (isDeleting === false) {
			try {
				const requests = ids.map(id =>
					axios.get(`${VITE_BACKEND_URL}/api/users/${id}`, {
						headers: {
							"Authorization": `Bearer ${tokenValue}`,
							"Content-Type": "application/json"},
						signal,
					})
				);
				const responses = await Promise.all(requests);
				const users = responses.map(response => response.data); // Extract user data

				setState(users);
				setFetchedState(true); // Indicate that data has been fetched

			} catch (error) {
				setError(true);
				setErrorMessage(error.message);
				if (axios.isCancel(error)) {
					console.log("Fetch aborted");
				} else {
					if (error.response) {
						console.error("Backend error:", error.response); // Server responded with an error
					} else {
						console.error("Request failed:", error.message); // Network error or request issue
					}
					// todo display error to user
				}
			}
		}
	}

	// display connections
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
						{/*<button className='chat'><BsChat /></button>*/}
						<button className='delete' onClick={() => {
							deleteConnection(connection.id, connection.username);
							// await getConnectionIds();
						}}
						>
							<FaRegCircleXmark /></button>
					</div>
				)}

				{connections === pendingConnections && (
					<div className='connections-buttons-container'>
						<button className='accept' onClick={() => acceptRequest(connection.id)}><FaRegCirclePlay /></button>
						<button className='delete' onClick={() => deleteConnection(connection.id, connection.username)}><FaRegCircleXmark /></button>
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
	}, [pendingConnections, currentConnections]);

	// delete connection
	const deleteConnection = (connectionId, connectionName) => { // connectionId, setConnections, setConnectionsIds
		// setIsDeleting(true);

		toDeleteId.current = connectionId;
		setToDeleteName(connectionName); // Use useState to trigger a re-render
		modal.style.display = 'flex'; // Show modal
	}

	// Handle the accept button click
	const acceptDelete = (setState, setIdState) => {
		setIsDeleting(true);

		let endpoint = "";
		let paramKey = "";

		if (setState === setPendingConnections) {
			endpoint = "deletePendingRequest";
			paramKey =  "pendingRequestId";
		}

		if (setState === setCurrentConnections) {
			endpoint = "deleteConnection";
			paramKey =  "connectionId";
		}

		if (!endpoint || !paramKey) {
			console.error("Invalid state setter function provided.");
			setIsDeleting(false);
			return;
		}

		try {
			setState((prevConnections) => prevConnections.filter((connection) => connection.id !== toDeleteId.current));
			setIdState((prevIds) => prevIds.filter((id) => id !== toDeleteId.current));
			//Remove the connection from the state
			axios.delete(`${VITE_BACKEND_URL}/api/${endpoint}`, {
				headers: {
					"Authorization": `Bearer ${tokenValue}`,
					"Content-Type": "application/json"},
				params: { [paramKey] : toDeleteId.current } // Include request parameters here
			});
			// 	setConnections(prev => prev.filter(conn => conn._id !== connectionId));
			// 	setConnectionsIds(prevIds => prevIds.filter(id => id !== connectionId))
			console.log("Connection deleted!");
		} catch (error) {
			setError(true);
			setErrorMessage(error.message);
				if (error.response) {
					console.error("Backend error:", error.response); // Server responded with an error
				} else {
					console.error("Request failed:", error.message); // Network error or request issue
				}
		} finally {
			setIsDeleting(false);
			modal.style.display = 'none'; // Close the modal
		}
	}

	const cancelDelete = () => {
		modal.style.display = 'none'; // Close the modal without navigating
	}

	const acceptRequest = (requestId) => {

		// add to connections
		try {
			axios.post(`${VITE_BACKEND_URL}/api/addConnection`, null, {
				headers: {
					"Authorization": `Bearer ${tokenValue}`,
					"Content-Type": "application/json"
				},
				params: {matchId: requestId} // Correct parameter name
			})

		} catch (error) {
			setError(true);
			setErrorMessage(error.message);
			if (error.response) {
				console.error("Backend error:", error.response); // Server responded with an error
			} else {
				console.error("Request failed:", error.message); // Network error or request issue
			}
		}

		// delete the pending request
		setIsDeleting(true);

		try {
			axios.delete(`${VITE_BACKEND_URL}/api/deletePendingRequest`, {
				headers: {
					"Authorization": `Bearer ${tokenValue}`,
					"Content-Type": "application/json"
				},
				params: {pendingRequestId: requestId} // Include request parameters here
			});
			setPendingConnections((prevConnections) => prevConnections.filter((connection) => connection.id !== requestId));
			setPendingConnectionIds((prevIds) => prevIds.filter((id) => id !== requestId));

			// 	setConnections(prev => prev.filter(conn => conn._id !== connectionId));
			// 	setConnectionsIds(prevIds => prevIds.filter(id => id !== connectionId))
			console.log("Pending request deleted!");
		} catch (error) {
			setError(true);
			setErrorMessage(error.message);
			if (error.response) {
				console.error("Backend error:", error.response); // Server responded with an error
			} else {
				console.error("Request failed:", error.message); // Network error or request issue
			}
		} finally {
			setIsDeleting(false);
		}
	}


	return (
		<div className='connections-container'>


			{!error ? (
				<>
					<div id="loadingModal" className="modal">
						<div className="modal-content">
							<p className='modal-text'>You are about to remove <br/> {toDeleteName}</p>
							<p style={{marginTop: '0.5rem'}}>Are you sure?</p>
							<div className='modal-buttons'>
								{pendingOrCurrent === "current" ? (
									<button id="acceptButton" onClick={() => {acceptDelete(setCurrentConnections, setCurrentConnectionIds)}}>
										<span>Yes</span>
									</button>
								) : (
									<button id="acceptButton" onClick={() => {acceptDelete(setPendingConnections, setPendingConnectionIds)}}>
										<span>Yes</span>
									</button>
								)
								}

								<button id="cancelButton" onClick={() => {cancelDelete()}}>
									<span>No</span>
								</button>
							</div>
						</div>
					</div>

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
								}}>Current connections
								</button>

								<button className='pending' onClick={() => {
									toggleButton(event);
									setPendingOrCurrent('pending');
								}}>Pending connections
								</button>
							</div>


							<div className='connections-list'>

								{pendingOrCurrent === 'current' && displayConnections(currentConnections)}

								{pendingOrCurrent === 'pending' && displayConnections(pendingConnections)}

							</div>

							<div className='user-stats-container'>
								{(pendingOrCurrent === "current" && currentConnections.length > 0) ||
								(pendingOrCurrent !== "current" && pendingConnections.length > 0) ? (
									<div className='user-stats'>
										You have {pendingOrCurrent === "current"
										? `${currentConnections.length} ${currentConnections.length === 1 ? "connection" : "connections"}`
										: `${pendingConnections.length} ${pendingConnections.length === 1 ? "request" : "requests"}`
									}
									</div>
								) : null}
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

export default Connections;

