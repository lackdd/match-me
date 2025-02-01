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
				<NavLink to='/dashboard' className={"profile-link"}>
					<img src='default_profile_picture.png' alt='Profile' className='profile-picture'/>
					John Smith
				</NavLink>
			</div>
			<div className='links-container'>
				<NavLink to='/connections' className={'connections'}>
					CONNECTIONS
				</NavLink>
				<NavLink to='/chats' className={'chats'}>
					CHATS
				</NavLink>
				<NavLink to='/recommendations' className={'recommendations'}>
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

