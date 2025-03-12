import './not-found.scss'
import Navigator from '../nav-bar-guest/nav-bar-guest.jsx';
// import {AuthContext} from '../../main.jsx';
import {useContext} from 'react';
import NavigatorUser from '../nav-bar-user/nav-bar-user.jsx';
import NavigatorGuest from '../nav-bar-guest/nav-bar-guest.jsx';
import { useAuth } from '../../AuthContext.jsx';

function NotFound() {
	// const {isUserLoggedIn} = useContext(AuthContext);
	const { isUserLoggedIn } = useAuth();

	return (
		<>
			{isUserLoggedIn ? <NavigatorUser /> : <NavigatorGuest/>}

			<div className='not-found-container'>
				<h1>404 Not Found</h1>
				<p>The page you are looking for does not exist.</p>
			</div>
		</>

	);
}

export default NotFound;