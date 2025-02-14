import './nav-bar-user.scss'
import {NavLink, useNavigate} from 'react-router-dom'
import {AuthContext} from "../../main.jsx";
import {useContext} from "react";


function NavigatorUser() {
	const { setIsUserLoggedIn } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleLogout = async () => {
		console.log('Logout successful');
		sessionStorage.removeItem("token");
		setIsUserLoggedIn(false);
		navigate("/");
	};

	return (
		<nav className='nav-container-user'>
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
			<div className='buttons-container'>
					<button className='button logout' title='Log out' onClick={handleLogout}>
						Log out
					</button>
			</div>
		</nav>
	);
}

export default NavigatorUser;

