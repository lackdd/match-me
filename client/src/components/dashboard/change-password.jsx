import {closeSettings} from '../reusables/profile-card-functions.jsx';
import {IoClose} from 'react-icons/io5';
import React, {useState} from 'react';
import './change-password.scss'
import {ShowPasswordButton} from '../reusables/showPasswordButton.jsx';
import {Link, useNavigate} from 'react-router-dom';

export function ChangePassword() {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [error, setError] = useState('placeholder-error');
	const [showPassword, setShowPassword] = useState(true);

	return (
		<>
			<button className='close-settings' type={'button'} onClick={() => {closeSettings();}}><IoClose /></button>
			<div className='change-password-content'>
				<form className={'change-password-form'} action=''>
					<label id='password-label'>
						Current password
						<br/>
						<div className={'with-button'}>
							<input
								type='password'
								id='current-password'
								className={`not-react-select focus-highlight ${error && error !== "placeholder-error" ? 'error' : ''}`}
								placeholder='Enter your password'
								value={currentPassword}
								onChange={(e) => setCurrentPassword(e.target.value)}
								autoComplete={'on'}
								required
							/>
							<ShowPasswordButton showPassword={showPassword} setShowPassword={setShowPassword} login={true}/>
						</div>

						<p className={`error-message ${error && error !== "placeholder-error" ? 'visible' : 'hidden'}`}>
							{error}
						</p>
					</label>
					<label id='password-label'>
						New password
						<br/>
						<div className={'with-button'}>
							<input
								type='password'
								id='new-password'
								className={`not-react-select focus-highlight ${error && error !== "placeholder-error" ? 'error' : ''}`}
								placeholder='Enter your password'
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								autoComplete={'on'}
								required
							/>
							<ShowPasswordButton showPassword={showPassword} setShowPassword={setShowPassword} login={true}/>
						</div>

						<p className={`error-message ${error && error !== "placeholder-error" ? 'visible' : 'hidden'}`}>
							{error}
						</p>
					</label>
				</form>
			</div>
		</>
	)
}