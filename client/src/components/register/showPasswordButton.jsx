import {FiEye, FiEyeOff} from 'react-icons/fi';

export function ShowPasswordButton(showPassword, setShowPassword) {
	return (
		<button
			tabIndex={-1}
			type={'button'}
			className={'show-password'}
			onMouseDown={(e) => e.preventDefault()} // Prevents losing focus and triggering validation
			onClick={
				() => {
					document.getElementById('password').type = document.getElementById('password').type === 'password' ? 'text' : 'password';
					document.getElementById('rePassword').type = document.getElementById('rePassword').type === 'password' ? 'text' : 'password';
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