import './nav-bar-user.scss'
import {NavLink, useNavigate} from 'react-router-dom'
// import {AuthContext} from "../../main.jsx";
import {useContext, useEffect, useRef, useState} from 'react';
import {useAuth} from '../utils/AuthContext.jsx';

// mobile icons
import { FiLogOut } from "react-icons/fi";
import { BsChat } from "react-icons/bs";
import { FaUserFriends } from "react-icons/fa";
import { PiMusicNotesPlus } from "react-icons/pi";
import axios from 'axios';


function NavigatorUser() {
	// const { setIsUserLoggedIn } = useContext(AuthContext);
	const navigate = useNavigate();
	const { isUserLoggedIn, logout, token } = useAuth();
	const [username, setUsername] = useState("");
	const [profilePicture, setProfilePicture] = useState("");
	const [gender, setGender] = useState("");
	const [pendingReqNum, setPendingReqNum] = useState("");
	const { tokenValue } = useAuth();

	// const token = useRef(sessionStorage.getItem("token"));
	// console.log("Token: ", token.current)

	const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

	const handleLogout = async () => {
		console.log('Logout successful');
		// sessionStorage.removeItem("token");
		// setIsUserLoggedIn(false);
		logout();
		navigate("/");
	};

	const getProfileInfo = async() => {

		console.log("Getting username and profile picture");

		try {
			const response = await axios.get(`${VITE_BACKEND_URL}/api/me`,{
				headers: { Authorization: `Bearer ${tokenValue}` },
		});

			setUsername(response.data.payload.username.split(' ')[0]);
			setProfilePicture(response.data.payload.profilePicture);

		} catch (error) {
			if (error.response) {
				console.error("Backend error:", error.response.data); // Server responded with an error
			} else {
				console.error("Request failed:", error.message); // Network error or request issue
			}
		}
	}

	const getGender = async() => {

		console.log("Getting gender");

		try {
			const response = await axios.get(`${VITE_BACKEND_URL}/api/me/profile`,{
				headers: { Authorization: `Bearer ${tokenValue}` },
			});

			setGender(response.data.payload.gender);

		} catch (error) {
			if (error.response) {
				console.error("Backend error:", error.response.data.payload); // Server responded with an error
			} else {
				console.error("Request failed:", error.message); // Network error or request issue
			}
		}
	}

	const getPendingRequests = async() => {

		console.log("Getting pending requests length");

		try {
			const response = await axios.get(`${VITE_BACKEND_URL}/api/pendingRequests`, {
					headers: {
						"Authorization": `Bearer ${tokenValue}`,
						"Content-Type": "application/json"},
				});

			// don't display 0
			if (response.data.payload.length > 0) {
				setPendingReqNum(response.data.payload.length)
			} else {
				setPendingReqNum("")
			}

		} catch (error) {
			if (axios.isCancel(error)) {
				console.log("Fetch aborted");
			} else {
				console.error("Error getting connections: ", (error.message))
				// todo display error to user
			}
		}
	}

	useEffect(() => {
		getProfileInfo();
		getGender();
		getPendingRequests();
	}, []);

	return (
		<>
			<nav className='nav-container-user default'>
				<div className='profile-container'>
					<NavLink to='/dashboard' tabIndex={-1} className={({ isActive }) =>
						`profile-link ${isActive ? 'current' : ''}`
					}>
						{/*<img src={profilePicture} alt='Profile' className='profile-picture'/>*/}
						{(gender === 'male') && <img src='profile_pic_male.jpg' alt={username} className='profile-picture'/>}
						{(gender === 'female') && <img src='profile_pic_female.jpg' alt={username} className='profile-picture'/>}
						{(gender !== 'female' && gender !== 'male') && <img src='default_profile_picture.png' alt={username} className='profile-picture'/>}


						{username}
					</NavLink>
				</div>
				<div className='links-container'>
					<NavLink to='/connections' tabIndex={-1} data-type-reqnum={pendingReqNum} className={({ isActive }) =>
						`connections ${isActive ? 'current' : ''}`
					}>
						CONNECTIONS
					</NavLink>
					<NavLink to='/chats' tabIndex={-1} className={({ isActive }) =>
						`chats ${isActive ? 'current' : ''}`
					}>
						CHATS
					</NavLink>
					<NavLink to='/recommendations' tabIndex={-1} className={({ isActive }) =>
						`recommendations ${isActive ? 'current' : ''}`
					}>
						RECOMMENDATIONS
					</NavLink>
				</div>
				<div className='nav-buttons-container'>
					<button className='button logout' title='Log out' tabIndex={-1} onClick={handleLogout}>
						Log out
					</button>
				</div>
			</nav>

			{/* todo*/}
			<nav className='nav-container-user mobile'>

				<div className='links-container'>
					<NavLink to='/connections' data-type-reqnum={pendingReqNum} className={({ isActive }) =>
						`icon connections ${isActive ? 'current' : ''}`
					}>
						<FaUserFriends />
					</NavLink>
					<NavLink to='/chats' className={({ isActive }) =>
						`icon chats ${isActive ? 'current' : ''}`
					}>
						<BsChat />
					</NavLink>
					<div className='profile-container'>
						<NavLink to='/dashboard' className={({ isActive }) =>
							`profile-link ${isActive ? 'current' : ''}`
						}>
							{(gender === 'male') && <img src='profile_pic_male.jpg' alt={username} className='profile-picture'/>}
							{(gender === 'female') && <img src='profile_pic_female.jpg' alt={username} className='profile-picture'/>}
							{(gender !== 'female' && gender !== 'male') && <img src='default_profile_picture.png' alt={username} className='profile-picture'/>}
						</NavLink>
					</div>
					<NavLink to='/recommendations' className={({ isActive }) =>
						`icon recommendations ${isActive ? 'current' : ''}`
					}>
						<PiMusicNotesPlus />
					</NavLink>
					<button className='logout' title='Log out' onClick={handleLogout}>
						<FiLogOut />
					</button>
				</div>
			</nav>
		</>

	);
}

export default NavigatorUser;

