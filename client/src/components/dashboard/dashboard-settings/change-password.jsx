import {closeSettings} from '../../reusables/profile-card-functions.jsx';
import {IoClose} from 'react-icons/io5';
import React, {useState} from 'react';
import './change-password.scss'
import {ShowPasswordButton} from '../../reusables/showPasswordButton.jsx';
import {Link, useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {stepOneSchema} from '../../register/validationSchema.jsx';
import {passwordValidationSchema} from './passwordValidationSchema.jsx';
import {ErrorElement} from '../../reusables/errorElement.jsx';
import axios from 'axios';

export function ChangePassword() {
	const [showPassword, setShowPassword] = useState(true);
	const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
	// Initialize react-hook-form with Yup schema
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		setError,
		clearErrors,
		trigger,
		formState: { errors },
	} = useForm({
		defaultValues: {
			currentPassword: '',
            newPassword: '',
            reNewPassword: '',
		},
		resolver: yupResolver(passwordValidationSchema),
		mode: 'onChange',
	});

	const checkPassword = () => {
		try {
			const password = axios.post(`${VITE_BACKEND_URL}/api/check-password`, {
				password: watch('currentPassword'),
			})

		} catch (error) {
			if (error.response) {
				console.error("Backend error:", error.response.data); // Server responded with an error
			} else {
				console.error("Request failed:", error.message); // Network error or request issue
			}
		}
	}

	return (
		<>
			<button
				className='close-settings'
				type={'button'}
				onClick={closeSettings}
			>
				<IoClose />
			</button>
			<div className='change-password-content'>
				<form
					className={'change-password-form'}
					autoComplete={'off'}
					noValidate
				>
					<label>
						Current password
						<br/>
						<div className={'with-button'}>
							<input
								type='password'
								id='currentPassword'
								placeholder='Enter your current password'
								value={watch('currentPassword')}
								className={`not-react-select focus-highlight 
									${errors.currentPassword ? "error" : ""}
									${!errors.currentPassword && watch('currentPassword') ? "valid" : ""}`}
								{...register("currentPassword")}
								autoComplete={"off"}
								onBlur={() => {
									checkPassword;
								}}
							/>
							<ShowPasswordButton showPassword={showPassword} setShowPassword={setShowPassword} changePassword={true}/>
						</div>
						<ErrorElement errors={errors}  id={'currentPassword'}/>

					</label>
					<label>
						New password
						<br/>
						<div className={'with-button'}>
							<input
								type='password'
								id='newPassword'
								placeholder='Enter a new password'
								value={watch('newPassword')}
								className={`not-react-select focus-highlight 
									${errors.newPassword ? "error" : ""}
									${!errors.newPassword && watch('newPassword') ? "valid" : ""}`}
								{...register("newPassword")}
								autoComplete={"off"}
							/>
							<ShowPasswordButton showPassword={showPassword} setShowPassword={setShowPassword} changePassword={true}/>
						</div>

						<ErrorElement errors={errors}  id={'newPassword'}/>

					</label>
					<label>
						New password again
						<br/>
						<div className={'with-button'}>
							<input
								type='password'
								id='reNewPassword'
								placeholder='Enter the new password again'
								value={watch('reNewPassword')}
								className={`not-react-select focus-highlight 
									${errors.reNewPassword ? "error" : ""}
									${!errors.reNewPassword && watch('reNewPassword') ? "valid" : ""}`}
								{...register("reNewPassword")}
								autoComplete={"off"}
							/>
							<ShowPasswordButton showPassword={showPassword} setShowPassword={setShowPassword} changePassword={true}/>
						</div>

						<ErrorElement errors={errors}  id={'reNewPassword'}/>

					</label>
				</form>
				<div className="settings-buttons-container">
					<button className="cancel" onClick={() => {
						reset();
						closeSettings();
					}} type={'button'} >
						Cancel
					</button>
					<button
						className={`save ${Object.keys(errors).length > 0 ? 'disabled' : ''}`}
						onClick={closeSettings}
						type={'submit'}
						form={'change-password-form'}
						disabled={Object.keys(errors).length > 0}
					>
						Save
					</button>
				</div>
			</div>
		</>
	)
}