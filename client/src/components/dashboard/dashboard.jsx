// WelcomeDashboard.js
import React, {useContext} from 'react';
import { useNavigate} from 'react-router-dom';
import {AuthContext} from "../../main.jsx"; // Import useHistory hook

function WelcomeDashboard({ username }) {
	const { setIsUserLoggedIn } = useContext(AuthContext);
	const history = useNavigate();

	const handleLogout = () => {
		// Perform logout actions here (e.g., clear session, remove authentication token)
		// After logout, redirect to the login page
		console.log('Logout successful');
		sessionStorage.removeItem("token");
		setIsUserLoggedIn(false);
		history('/');
	};

	return (
		<div className="d-flex justify-content-center align-items-center vh-100">
			<div className="border rounded-lg p-4" style={{width: '500px', height: '400px'}}>
				<h2 className="mb-4 text-center">Welcome to Dashboard</h2>
				<p className="mb-4 text-center">Hello, {username}!</p>
				<p className="text-center">You are logged in successfully.</p>
				<div className="text-center">
					<button type="button" className="btn btn-primary mt-3" onClick={handleLogout}>Logout</button>
				</div>
			</div>
		</div>
	);
}

export default WelcomeDashboard;
