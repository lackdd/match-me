import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {stepOneSchema} from '../register/validationSchema.jsx';
{/*import {ErrorElement} from '../register/errorElement.jsx';*/}
import Select from 'react-select';
import {customStyles} from '../register/customInputStyles.jsx';
import {genderOptions} from '../register/inputOptions.jsx';
import {IncrementDecrementButtons} from '../register/incrementDecrementButtons.jsx';
import './dashboard.scss'
import '../register/register.scss'

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
		defaultValues: {
			firstName: "",
			lastName: "",
			gender: "",
			age: "",
		},
		resolver: yupResolver(stepOneSchema),
		mode: 'onChange',
	});

	return (
		<form className="step-one"
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
				<label className="short">
					First name*
					<input
						type="text"
						placeholder="Enter your first name"
						className={`not-react-select short focus-highlight 
							${errors.firstName ? "error" : ""}
							${!errors.firstName && watch('firstName') ? "valid" : ""}`}
						{...register("firstName")}
						autoComplete={"off"}
						// autoFocus={'on'}
						onBlur={() => trigger('firstName')} // Trigger validation when user leaves the field
					/>
					{/*/!*<ErrorElement errors={errors}  id={'firstName'}/>*!/*/}

				</label>

				{/* Last Name */}
				<label className="short">
					Last name*
					<input
						type="text"
						placeholder="Enter your last name"
						className={`not-react-select short focus-highlight 
							${errors.lastName ? "error" : ""}
							${!errors.lastName && watch('lastName') ? "valid" : ""}`}
						{...register("lastName")}
						autoComplete={"off"}
						onBlur={() => trigger('lastName')} // Trigger validation when user leaves the field
					/>
					{/*<ErrorElement errors={errors}  id={'lastName'}/>*/}
				</label>
			</div>

			{/* Gender and Age */}
			<div className="line">
				<label className="short">
					Gender*
					<Select
						className={`basic-single short`}
						classNamePrefix="select"
						menuWidth="short"
						name={"gender"}
						isValid={!errors.gender && watch('gender') !== ''}
						isError={errors.gender} // Set error if cleared
						isClearable
						isSearchable
						styles={customStyles}
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

					{/*<ErrorElement errors={errors}  id={'gender'}/>*/}
				</label>

				<label className="short">
					Age*
					<div className={'with-button'}>
						<input
							id={'age'}
							type='number'
							placeholder='Enter your age'
							className={`not-react-select short focus-highlight 
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

					{/*<ErrorElement errors={errors} id={'age'}/>*/}
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
