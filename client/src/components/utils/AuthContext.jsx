// In a new file called AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
	const [tokenValue, setTokenValue] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
	// const history = useNavigate();

	useEffect(() => {
		const validateToken = async () => {
			setIsLoading(true);
			const token = sessionStorage.getItem("token");

			if (!token) {
				setIsUserLoggedIn(false);
				setIsLoading(false);
				setTokenValue("");
				return;
			}

			try {
				await axios.post(
					`${VITE_BACKEND_URL}/api/validateToken`,
					{},
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				console.log("Token is valid. Logging in");
				setIsUserLoggedIn(true);
				setTokenValue(token);
			} catch (error) {
				console.error("Failed to validate token:", error);
				setIsUserLoggedIn(false);
				sessionStorage.removeItem("token"); // Clear invalid token
				setTokenValue("");
			} finally {
				setIsLoading(false);
			}
		};

		validateToken();
	}, [VITE_BACKEND_URL]);

	const login = async (token) => {
		sessionStorage.setItem("token", token);
		setIsUserLoggedIn(true);
		setTokenValue(token);
		// history('/dashboard')
	};

	const logout = () => {
		sessionStorage.removeItem("token");
		setIsUserLoggedIn(false);
		setTokenValue("");
	};

	return (
		<AuthContext.Provider value={{
			isUserLoggedIn,
			setIsUserLoggedIn,
			login,
			logout,
			isLoading,
			tokenValue
		}}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
