import './nav-bar-user.scss'
import {NavLink, useNavigate} from 'react-router-dom'
// import {AuthContext} from "../../main.jsx";
import {useContext} from "react";
import {useAuth} from '../utils/AuthContext.jsx';

// mobile icons
import { FiLogOut } from "react-icons/fi";
import { BsChat } from "react-icons/bs";
import { FaUserFriends } from "react-icons/fa";
import { PiMusicNotesPlus } from "react-icons/pi";


function NavigatorUser() {
	// const { setIsUserLoggedIn } = useContext(AuthContext);
	const navigate = useNavigate();
	const { isUserLoggedIn, logout } = useAuth();

	const handleLogout = async () => {
		console.log('Logout successful');
		// sessionStorage.removeItem("token");
		// setIsUserLoggedIn(false);
		logout();
		navigate("/");
	};

	return (
		<>
			<nav className='nav-container-user default'>
				<div className='profile-container'>
					<NavLink to='/dashboard' className={({ isActive }) =>
						`profile-link ${isActive ? 'current' : ''}`
					}>
						<img src='default_profile_picture.png' alt='Profile' className='profile-picture'/>
						John
					</NavLink>
				</div>
				<div className='links-container'>
					<NavLink to='/connections' className={({ isActive }) =>
						`connections ${isActive ? 'current' : ''}`
					}>
						CONNECTIONS
					</NavLink>
					<NavLink to='/chats' className={({ isActive }) =>
						`chats ${isActive ? 'current' : ''}`
					}>
						CHATS
					</NavLink>
					<NavLink to='/recommendations' className={({ isActive }) =>
						`recommendations ${isActive ? 'current' : ''}`
					}>
						RECOMMENDATIONS
					</NavLink>
				</div>
				<div className='nav-buttons-container'>
					<button className='button logout' title='Log out' onClick={handleLogout}>
						Log out
					</button>
				</div>
			</nav>

			{/* todo*/}
			<nav className='nav-container-user mobile'>

				<div className='profile-container'>
					<NavLink to='/dashboard' className={({ isActive }) =>
						`profile-link ${isActive ? 'current' : ''}`
					}>
						<img src='default_profile_picture.png' alt='Profile' className='profile-picture'/>
					</NavLink>
				</div>
				<div className='links-container'>
					<NavLink to='/connections' className={({ isActive }) =>
						`icon connections ${isActive ? 'current' : ''}`
					}>
						<FaUserFriends />
					</NavLink>
					<NavLink to='/chats' className={({ isActive }) =>
						`icon chats ${isActive ? 'current' : ''}`
					}>
						<BsChat />
					</NavLink>
					<NavLink to='/recommendations' className={({ isActive }) =>
						`icon recommendations ${isActive ? 'current' : ''}`
					}>
						<PiMusicNotesPlus />
					</NavLink>
				</div>
				<div className='nav-buttons-container'>
					<button className='logout' title='Log out' onClick={handleLogout}>
						<FiLogOut />
					</button>
				</div>
			</nav>
		</>

	);
}

export default NavigatorUser;

