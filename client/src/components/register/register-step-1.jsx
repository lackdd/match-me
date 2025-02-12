import Select from 'react-select';
import {genderOptions} from './inputOptions.jsx';
import {customStyles} from './customInputStyles.jsx';
import makeAnimated from 'react-select/animated';
import { useForm } from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {stepOneSchema} from './validationSchema.jsx';
import {ErrorElement} from './error-element.jsx';



function Step1({ formOneData, setFormOneData, onSubmit}) {

	// Initialize react-hook-form with Yup schema
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		clearErrors,
		trigger,
		formState: { errors },
	} = useForm({
		defaultValues: formOneData,
		resolver: yupResolver(stepOneSchema),
		mode: 'onChange',
	});


		return (
			<form className="step-one"
				  onSubmit={handleSubmit((data) => onSubmit(data, formOneData, setFormOneData))}
				  autoComplete={'off'}
				  noValidate>
				<div className="form-title">
					<h1>Get started!</h1>
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
							onBlur={() => trigger('firstName')} // Trigger validation when user leaves the field
						/>
						<ErrorElement errors={errors}  id={'firstName'}/>

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
						<ErrorElement errors={errors}  id={'lastName'}/>
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
							components={makeAnimated()}
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

					<label className="short">
						Age*
						<input
							type="number"
							placeholder="Enter your age"
							className={`not-react-select short focus-highlight 
							${errors.age ? "error" : ""}
							${!errors.age && watch('age') ? "valid" : ""}`}
							{...register("age")}
							autoComplete={"off"}
							min={0}
							max={120}
							onBlur={() => trigger('age')} // Trigger validation when user leaves the field
						/>
						<ErrorElement errors={errors}  id={'age'}/>
					</label>
				</div>

				{/* Email */}
				<div className="line large">
					<label>
						Email address*
						<input
							type='email'
							placeholder='Enter your email address'
							className={`not-react-select focus-highlight 
							${errors.email ? 'error' : ''}
							${!errors.email && watch('email') ? 'valid' : ''}`}
							{...register('email')}
							autoComplete={'off'}
							onBlur={() => trigger('email')} // Trigger validation when user leaves the field
						/>
						<ErrorElement errors={errors} id={'email'}/>
					</label>
				</div>

				{/* Password */}
				<div className='line large'>
					<label>
						Password*
						<input
							type='password'
							placeholder='Enter a password'
							className={`not-react-select focus-highlight 
							${errors.password ? "error" : ""}
							${!errors.password && watch('password') ? "valid" : ""}`}
							{...register("password")}
							autoComplete={"off"}
							onBlur={() => trigger('password')} // Trigger validation when user leaves the field
						/>
						<ErrorElement errors={errors}  id={'password'}/>
					</label>
				</div>

				{/* Confirm Password */}
				<div className="line large">
					<label>
						Re-enter password*
						<input
							type="password"
							placeholder="Re-enter password"
							className={`not-react-select focus-highlight 
							${errors.rePassword ? "error" : ""}
							${!errors.rePassword && watch('rePassword') ? "valid" : ""}`}
							{...register("rePassword")}
							autoComplete={"off"}
							onBlur={() => trigger('rePassword')} // Trigger validation when user leaves the field
						/>
						<ErrorElement errors={errors}  id={'rePassword'}/>
					</label>
				</div>

				{/* Terms and Conditions */}
				<label id="tc-label">
					<input className="focus-highlight" type="checkbox" id='tc-input' {...register("terms")} />
					&nbsp; I agree to the terms and conditions*
				</label>

				<div className={'error-line'}>
                    {errors.terms && <p className="error-text">{errors.terms.message}</p>}
                </div>

				{/* Submit Button */}
				<div className="buttons-container">
					<button className={`next wide small ${Object.keys(errors).length > 0 ? "disabled" : ""}`}
							type="submit">
						Next
					</button>
				</div>
			</form>
		);
	};


export default Step1;