import {Navigate, Outlet} from 'react-router-dom';
import {useAuth} from './AuthContext.jsx';

// navigate user to /login when not logged in and trying to access protected routes
const ProtectedRoute = () => {
	const {isUserLoggedIn} = useAuth();

	return isUserLoggedIn ? <Outlet/> : <Navigate to='/login' replace/>;
};

export default ProtectedRoute;