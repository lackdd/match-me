import './nav-bar-user.scss'
import {NavLink} from 'react-router-dom'


function NavigatorUser() {
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
				{/* use <a> tag here to force a rerender so the nav bar changes back to NavigatorGuest. <Link> doesn't force rerender*/}
				<a href='/' className={'logout-link'}>
					<button className='button logout' title='Log out'>
						Log out
					</button>
				</a>
			</div>
		</nav>
	);
}

export default NavigatorUser;

