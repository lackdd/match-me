import './login.scss'
import {Link, Navigate, useNavigate} from 'react-router-dom';
import {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {AuthContext} from "../../App.jsx";

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const history = useNavigate();

	const {isUserLoggedIn, setIsUserLoggedIn} = useContext(AuthContext);

	if (isUserLoggedIn == true) {
		return <Navigate to="/dashboard" replace />;
	}

	const handleLogin = async (event) => {
		event.preventDefault();

		try {
			if (!email || !password) {
				setError('Please enter a username and a password')
			}
			const response = await
				axios.post('http://localhost:8080/login', {email, password});
			console.log('Login successful: ', response.data);
			sessionStorage.setItem("token", response.data.token);
			setIsUserLoggedIn(true);
			history('/dashboard')
		} catch (error) {
			console.error('Login failed: ', error.response ? error.response.data : error.message);
			setError('Invalid username or password.')
		}
	}


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
						className={`${error ? 'error-border' : ''}`}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</label>
				<label id='password-label'>
					Password
					<br/>
					<input
						type='password'
						id='password-input'
						className={`${error ? 'error-border' : ''}`}
						placeholder='Enter your password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					<Link to='/forgot-password' id='forgot-password'>forgot password?</Link>
					<p className={`error-message ${error ? 'visible' : 'hidden'}`}>
						{error}
					</p>
				</label>
				<label id='remember-me-label'>
					<input
						type='checkbox'
						name='remember'
						id='remember-me-input'/>
					&nbsp;
					Remember for 30 days
				</label>
				<label>
					<button
						className='login-button wide small'
						onClick={handleLogin}
						type={"submit"}>
						Login
					</button>
				</label>
			</form>
			<div id='no-account-label'>
				Don't have an account?
				&nbsp;
				<Link to='/register'>Sign up</Link>
			</div>
		</div>
	);
}

export default Login;
