import * as yup from 'yup';
import axios from 'axios';

export const stepOneSchema = (formOneData) =>
	yup.object().shape({
		firstName: yup.string()
			.required("Required")
			.matches(/[a-zA-Z]+/g, "Must use letters")
			.max(30, "Max 30 characters"),
		lastName: yup.string()
			.required("Required")
			.matches(/[a-zA-Z]+/g, "Must use letters")
			.max(30, "Max 30 characters"),
		gender: yup.object()
			.shape({
				label: yup.string(),
				value: yup.string()
			})
			.required("Required")
			.typeError("Required"),
		age: yup.number()
			.required("Required")
			.typeError("Required")
			.min(16, "Minimum age is 16")
			.max(120, "Maximum age is 120"),
		email: yup.string()
			.email("Enter a valid email address")
			.required("Required"),
		password: yup.string()
			.required("Required")
			.min(3, "Must contain at least 3 characters including 1 number")
			.matches(/[0-9]/, "Must contain at least one number"),
		rePassword: yup.string()
			.oneOf([yup.ref("password"), null], "Passwords must match")
			.required("Re-enter password"),
		terms: yup.boolean().oneOf([true], "You must accept the terms and conditions"),
	});

export const stepTwoSchema = (formThreeData) =>
	yup.object().shape({
	preferredMethods:
		yup
			.array()
			.of(
				yup.object().shape({
					label: yup.string().required(),
					value: yup.string().required(),
				})
			)
			.min(1, "Required"),
		preferredGenres:
			yup
				.array()
				.of(
					yup.object().shape({
						label: yup.string().required(),
						value: yup.string().required(),
					})
				)
				.min(1, "Required"),
		additionalInterests:
			yup
				.array()
				.of(
					yup.object().shape({
						label: yup.string().required(),
						value: yup.string().required(),
					})
				)
				.min(1, "Required"),
		personalityTraits:
			yup
				.array()
				.of(
					yup.object().shape({
						label: yup.string().required(),
						value: yup.string().required(),
					})
				)
				.min(1, "Required"),
		goals:
			yup
				.array()
				.of(
					yup.object().shape({
						label: yup.string().required(),
						value: yup.string().required(),
					})
				)
				.min(1, "Required"),
});

export const stepThreeSchema = (formOneData) =>
	yup.object().shape({
	experience: yup
		.number()
		.required("Required")
		.typeError("Required")
		.min(0, "Minimum 0 years")
		.max(
			formOneData.age, // Use formOneData.age directly here
			`Maximum your age: ${formOneData.age}`
		), // Dynamically use formOneData.age
	location: yup.object().shape({
				label: yup.string().required(),
				value: yup.string().required(),
			}
		)
		.typeError("Required")
		.required("Required"), // Ensures it's not empty
	musicLink: yup
		.string()
		.url("Must be a link")
		.notRequired(),
	description: yup
		.string()
		.min(0, "")
		.max(300, "Maximum 300 characters")
		.notRequired(),
});

export const stepFiveSchema = (formFiveData) =>
	yup.object().shape({
		matchPreferredMethods:
			yup
				.array()
				.of(
					yup.object().shape({
						label: yup.string().required(),
						value: yup.string().required(),
					})
				)
				.min(1, "Required"),
		matchPreferredGenres:
			yup
				.array()
				.of(
					yup.object().shape({
						label: yup.string().required(),
						value: yup.string().required(),
					})
				)
				.min(1, "Required"),
		matchGoals:
			yup
				.array()
				.of(
					yup.object().shape({
						label: yup.string().required(),
						value: yup.string().required(),
					})
				)
				.min(1, "Required"),
		matchGender: yup.object()
			.shape({
				label: yup.string(),
				value: yup.string()
			})
			.required("Required")
			.typeError("Required"),
		matchAge: yup.object()
			.shape({
				label: yup.string(),
				value: yup.string()
			})
			.required("Required")
			.typeError("Required"),
		matchExperience: yup.object()
			.shape({
				label: yup.string(),
				value: yup.string()
			})
			.required("Required")
			.typeError("Required"),
		matchLocation: yup.object()
			.shape({
				label: yup.string(),
				value: yup.string()
			})
			.required("Required")
			.typeError("Required"),
	});