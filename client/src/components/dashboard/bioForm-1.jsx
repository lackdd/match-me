import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {stepOneSchemaDashboard} from '../reusables/validationSchema.jsx';
import Select, {mergeStyles} from 'react-select';
import {customStyles} from '../reusables/customInputStyles.jsx';
import {dashboardFormStyles} from './dashboardFormStyles.jsx';
import {genderOptions} from '../reusables/inputOptions.jsx';
import {IncrementDecrementButtons} from '../reusables/incrementDecrementButtons.jsx';
import './forms.scss'
// import '../register/register.scss'
import '../reusables/incrementDecrementButtons.scss'
import '../reusables/errorElement.scss'
import {ErrorElement} from '../reusables/errorElement.jsx';
import {useEffect} from 'react';

const combinedStyles = mergeStyles(customStyles, dashboardFormStyles)

export function BioForm1() {
	// Initialize react-hook-form with Yup schema
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		clearErrors,
		setError,
		trigger,
		formState: { errors },
	} = useForm({
		defaultValues: { //todo get values from server
			firstName: "",
			lastName: "",
			gender: null,
			age: "",
		},
		// resolver: stepOneSchemaDashboard,
		resolver: yupResolver(stepOneSchemaDashboard),
		mode: 'onChange',
	});

	useEffect(() => {
		console.log("Errors changed:", errors);
	}, [errors]);

	return (
		<form className="step-one-dashboard"
			  onSubmit={handleSubmit((data) => {
				  // onSubmit(data, formOneData, setFormOneData);
				  console.log("Errors on submit: ", errors);
			  })}
			  autoComplete={'off'}
			  noValidate>
			<div className="form-title">
				<h1>Basic info</h1>
			</div>

			{/* First Name */}
			<div className="line">
				<label className="long">
					First name*
					<input
						type="text"
						placeholder="Enter your first name"
						className={`not-react-select long focus-highlight 
							${errors.firstName ? "error" : ""}
							${!errors.firstName && watch('firstName') ? "valid" : ""}`}
						{...register("firstName")}
						autoComplete={"off"}
						// autoFocus={'on'}
						onBlur={() => trigger('firstName')} // Trigger validation when user leaves the field
					/>
					<ErrorElement errors={errors}  id={'firstName'}/>

				</label>

				{/* Last Name */}
				<label className="long">
					Last name*
					<input
						type="text"
						placeholder="Enter your last name"
						className={`not-react-select long focus-highlight 
							${errors.lastName ? "error" : ""}
							${!errors.lastName && watch('lastName') ? "valid" : ""}`}
						{...register("lastName")}
						autoComplete={"off"}
						onBlur={() => trigger('lastName')} // Trigger validation when user leaves the field
					/>
					<ErrorElement errors={errors}  id={'lastName'}/>
				</label>
			</div>

			{/* Gender and Age */}
			<div className="line">
				<label className="long">
					Gender*
					<Select
						className={`basic-single long`}
						classNamePrefix="select"
						// menuWidth="short"
						wideMenu={false}
						name={"gender"}
						isValid={!errors.gender && watch('gender') !== ''}
						isError={errors.gender} // Set error if cleared
						isClearable
						isSearchable
						styles={combinedStyles}
						menuTop={false}
						// components={makeAnimated()}
						options={genderOptions}
						placeholder="Select gender"
						value={watch('gender')}
						autoComplete={"off"}
						onChange={(selectedOption) => {
							if (!selectedOption) {
								setValue("gender", "");  // Clear value when selection is cleared
							} else {
								setValue("gender", selectedOption);
								clearErrors("gender");
							}
						}}
						onBlur={() => trigger('gender')} // Trigger validation when user leaves the field
					/>

					<ErrorElement errors={errors}  id={'gender'}/>
				</label>

				<label className="long">
					Age*
					<div className={'with-button'}>
						<input
							id={'age'}
							type='number'
							placeholder='Enter your age'
							className={`not-react-select long focus-highlight 
							${errors.age ? 'error' : ''}
							${!errors.age && watch('age') ? 'valid' : ''}`}
							{...register('age')}
							autoComplete={'off'}
							min={0}
							max={120}
							onBlur={() => trigger('age')} // Trigger validation when user leaves the field
						/>
						<IncrementDecrementButtons id={'age'} watch={watch} setValue={setValue} trigger={trigger} />
					</div>

					<ErrorElement errors={errors} id={'age'}/>
				</label>
			</div>

			{/*/!* Submit Button *!/*/}
			{/*<div className='buttons-container'>*/}
			{/*	<button className={`next wide small ${Object.keys(errors).length > 0 ? 'disabled' : ''}`}*/}
			{/*			type='submit'*/}
			{/*			disabled={Object.keys(errors).length > 0}*/}
			{/*	>*/}
			{/*		Next*/}
			{/*	</button>*/}
			{/*</div>*/}
		</form>
	);
}
