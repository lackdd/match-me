import {FiEye, FiEyeOff} from 'react-icons/fi';
import './showPasswordButton.scss'


export function ShowPasswordButton({showPassword, setShowPassword, login = false, register = false, changePassword = false }) {
	return (
		<button
			tabIndex={-1}
			type={'button'}
			className={'show-password'}
			onMouseDown={(e) => e.preventDefault()} // Prevents losing focus and triggering validation
			onClick={
				() => {
					if (login) {
						document.getElementById('password-login').type = document.getElementById('password-login').type === 'password' ? 'text' : 'password';
					} else if (register) {
						document.getElementById('password').type = document.getElementById('password').type === 'password' ? 'text' : 'password';
						document.getElementById('rePassword').type = document.getElementById('rePassword').type === 'password' ? 'text' : 'password';
					} else {
						document.getElementById('currentPassword').type = document.getElementById('currentPassword').type === 'password' ? 'text' : 'password';
						document.getElementById('newPassword').type = document.getElementById('newPassword').type === 'password' ? 'text' : 'password';
						document.getElementById('reNewPassword').type = document.getElementById('reNewPassword').type === 'password' ? 'text' : 'password';
					}
					setShowPassword(!showPassword);
				}
			}
		>
			{showPassword ? (
					<FiEye/>
				) :
				(<FiEyeOff/>)}
		</button>
	)
}