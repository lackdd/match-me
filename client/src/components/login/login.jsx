import './login.scss'
import {Link} from 'react-router-dom';

function Login() {
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
						<input type='email' placeholder='Enter your email' required/>
					</label>
					<label id='password-label'>
						Password
						<br/>
						<input
							type='password' id='password-input' placeholder='Enter your password' required
						/>
						<Link to='/forgot-password' id='forgot-password'>forgot password?</Link>
					</label>
					<label id='remember-me-label'>
						<input type='checkbox' name='remember' id='remember-me-input'/>
						&nbsp;
						Remember for 30 days
					</label>
					<label>
						<button className='login-button'>Login</button>
					</label>
				</form>
				<div id='no-account-label'>
					Don't have an account?
					&nbsp;
					<Link to='/get-started'>Sign up</Link>
				</div>
			</div>
	);
}

export default Login;