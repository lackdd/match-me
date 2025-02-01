import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import {AuthContext} from './main.jsx';
import {useContext} from 'react';

const ProtectedRoute = () => {
	// const { isUserLoggedIn } = useOutletContext();
	const { isUserLoggedIn } = useContext(AuthContext);

	return isUserLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;