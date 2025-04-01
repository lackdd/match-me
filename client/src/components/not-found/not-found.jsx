import './not-found.scss';
import NavigatorUser from '../nav-bar-user/nav-bar-user.jsx';
import NavigatorGuest from '../nav-bar-guest/nav-bar-guest.jsx';
import {useAuth} from '../utils/AuthContext.jsx';

// when user tries to navigate to a route that does not exist
function NotFound() {
	const {isUserLoggedIn} = useAuth();

	return (
		<>
			{isUserLoggedIn ? <NavigatorUser/> : <NavigatorGuest/>}

			<div className='not-found-container'>
				<h1>404 Not Found</h1>
				<p>The page you are looking for does not exist.</p>
			</div>
		</>

	);
}

export default NotFound;