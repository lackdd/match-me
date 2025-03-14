import './login.scss'
import {Link, Navigate, useNavigate} from 'react-router-dom';
import {useContext, useEffect, useState} from 'react';
import axios from 'axios';
// import {AuthContext} from "../../main.jsx";
import {ErrorElement} from '../register/errorElement.jsx';
import {ShowPasswordButton} from '../register/showPasswordButton.jsx';
import { useAuth } from '../utils/AuthContext.jsx';

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('placeholder-error');
	const history = useNavigate();
	const [showPassword, setShowPassword] = useState(true);


	const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

	// const {isUserLoggedIn, setIsUserLoggedIn} = useContext(AuthContext);


	//
	//
	// if (isUserLoggedIn === true) {
	// 	return <Navigate to="/dashboard" replace />;
	// }
	//
	// const handleLogin = async (event) => {
	// 	event.preventDefault();
	//
	// 	try {
	// 		if (!email || !password) {
	// 			setError('Please enter a username and a password');
	// 			return;
	// 		}
	//
	// 		const response = await
	// 			axios.post(`${VITE_BACKEND_URL}/api/login`, {email, password});
	// 		setError("")
	// 		console.log('Login successful: ', response.data);
	// 		sessionStorage.setItem("token", response.data);
	// 		setIsUserLoggedIn(true);
	// 		history('/dashboard')
	// 	} catch (error) {
	// 		console.error('Login failed: ', error.response ? error.response.data : error.message);
	// 		setError('Invalid username or password.')
	// 	}
	// }

	const { login } = useAuth();

	const handleLogin = async (event) => {
		event.preventDefault();

		try {
			if (!email || !password) {
				setError('Please enter a username and a password');
				return;
			}

			const response = await axios.post(`${VITE_BACKEND_URL}/api/login`, {email, password});
			setError("");
			const token = response.data;
			await login(token);
			console.log("Login successful: ", response.data);
			// Navigate to dashboard or other protected route
			history('/dashboard')
		} catch (error) {
			if (error.response) {
				console.error("Backend error:", error.response.data); // Server responded with an error
			} else {
				console.error("Request failed:", error.message); // Network error or request issue
			}
		}
	};

	// const handleLogin = async (credentials) => {
	// 	try {
	// 		const response = await axios.post(`${VITE_BACKEND_URL}/api/login`, credentials);
	// 		const token = response.data.token;
	// 		await login(token);
	// 		console.log("Login successful");
	// 		// Navigate to dashboard or other protected route
	// 	} catch (error) {
	// 		console.error("Login failed:", error);
	// 	}
	// };


	return (
		<div className='login-container'>
			<form className='login-form'>
				<div className='form-title'>
					<h1>Welcome back!</h1>
					<h2>Enter you credentials to access your account</h2>
				</div>
				<label>
					Email address
					<br/>
					<input
						type='email'
						id='email-input'
						placeholder='Enter your email'
						className={`not-react-select focus-highlight ${error && error !== "placeholder-error" ? 'error' : ''}`}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						autoComplete={"on"}
						autoFocus={true}
						required
					/>
				</label>
				<label id='password-label'>
					Password
					<br/>
					<div className={'with-button'}>
						<input
							type='password'
							id='password-login'
							className={`not-react-select focus-highlight ${error && error !== "placeholder-error" ? 'error' : ''}`}
							placeholder='Enter your password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							autoComplete={'on'}
							required
						/>
						<ShowPasswordButton showPassword={showPassword} setShowPassword={setShowPassword} login={true}/>
					</div>

					<Link to='/forgot-password' id='forgot-password' tabIndex={-1}>forgot password?</Link>
					<p className={`error-message ${error && error !== "placeholder-error" ? 'visible' : 'hidden'}`}>
						{error}
					</p>
				</label>
				<label id='remember-me-label'>
					<input
						className={'focus-highlight'}
						type='checkbox'
						name='remember'
						id='remember-me-input'/>
					&nbsp;
					{/* todo add functionality to keep token in storagr for 30 days */}
					Remember for 30 days
				</label>
				<label>
					<button
						className='login-button wide small'
						onClick={handleLogin}
						type={"submit"}
						// disabled={error}
					>
						Login
					</button>
				</label>
			</form>
			<div id='no-account-label'>
				Don't have an account?
				&nbsp;
				<Link to='/register' tabIndex={-1}>Sign up</Link>
			</div>
		</div>
	);
}

export default Login;
