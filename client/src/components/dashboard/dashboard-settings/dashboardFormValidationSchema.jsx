import * as yup from 'yup';

export const dashboardFormValidationSchema =
	// step 1
	yup.object().shape({
		firstName: yup.string()
			.required('Required')
			.matches(/[a-zA-Z]+/g, 'Must use letters')
			.max(30, 'Max 30 characters'),
		lastName: yup.string()
			.required('Required')
			.matches(/[a-zA-Z]+/g, 'Must use letters')
			.max(30, 'Max 30 characters'),
		gender: yup.object()
			.shape({
				label: yup.string(),
				value: yup.string()
			})
			.required('Required'),
		// .typeError("Required"),
		// age: yup.number()
		// 	.required('Required')
		// 	.typeError('Required')
		// 	.min(16, 'Minimum age is 16')
		// 	.max(120, 'Maximum age is 120'),

		// step 2
		preferredMethod:
			yup
				.array()
				.of(
					yup.object().shape({
						label: yup.string().required(),
						value: yup.string().required()
					})
				)
				.min(1, 'Required'),
		preferredGenres:
			yup
				.array()
				.of(
					yup.object().shape({
						label: yup.string().required(),
						value: yup.string().required()
					})
				)
				.min(1, 'Required'),
		additionalInterests:
			yup
				.array()
				.of(
					yup.object().shape({
						label: yup.string().required(),
						value: yup.string().required()
					})
				)
				.min(1, 'Required'),
		personalityTraits:
			yup
				.array()
				.of(
					yup.object().shape({
						label: yup.string().required(),
						value: yup.string().required()
					})
				)
				.min(1, 'Required'),
		goalsWithMusic:
			yup
				.array()
				.of(
					yup.object().shape({
						label: yup.string().required(),
						value: yup.string().required()
					})
				)
				.min(1, 'Required'),

		// step 3
		yearsOfMusicExperience: yup
			.number()
			.required('Required')
			.typeError('Required')
			.min(0, 'Minimum 0 years')
			.max(120),
		location: yup.object().shape({
				label: yup.string().required(),
				value: yup.string().required()
			}
		)
			.typeError('Required')
			.required('Required'), // Ensures it's not empty
		linkToMusic: yup
			.string()
			.url('Must be a link')
			.notRequired(),
		description: yup
			.string()
			.min(0, '')
			.max(300, 'Maximum 300 characters')
			.notRequired(),

		// New geolocation fields
		latitude: yup
			.number()
			.nullable()
			.transform((value) => (isNaN(value) ? null : value)),
		longitude: yup
			.number()
			.nullable()
			.transform((value) => (isNaN(value) ? null : value))
	});
