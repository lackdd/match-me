import * as yup from 'yup';

export const passwordValidationSchema =
	yup.object().shape({
		currentPassword: yup.string()
			.required('Required')
			.max(30, 'Max 30 characters'),
		newPassword: yup.string()
			.required('Required')
			.min(3, 'Must contain at least 3 characters')
			.max(30, 'Max 30 characters')
			.matches(/[0-9]/, 'Must contain at least one number'),
		reNewPassword: yup.string()
			.oneOf([yup.ref('newPassword'), null], 'Passwords must match')
			.required('Required')
			.max(30, 'Max 30 characters')
	});