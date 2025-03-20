import {FiEye, FiEyeOff} from 'react-icons/fi';
import './showPasswordButton.scss'


export function ShowPasswordButton({showPassword, setShowPassword, login = false}) {
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
					} else {
						document.getElementById('password').type = document.getElementById('password').type === 'password' ? 'text' : 'password';
						document.getElementById('rePassword').type = document.getElementById('rePassword').type === 'password' ? 'text' : 'password';
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