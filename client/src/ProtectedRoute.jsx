import { Navigate, Outlet, useOutletContext } from "react-router-dom";
// import {AuthContext} from './main.jsx';
import {useContext} from 'react';
import { useAuth } from './AuthContext.jsx';

const ProtectedRoute = () => {
	// const { isUserLoggedIn } = useOutletContext();
	// const { isUserLoggedIn } = useContext(AuthContext);
	const { isUserLoggedIn } = useAuth();

	return isUserLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;