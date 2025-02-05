import Select from 'react-select';
import {genderOptions} from './inputOptions.jsx';
import {customStyles} from './customInputStyles.jsx';
import {useState} from 'react';
import makeAnimated from 'react-select/animated';
import {Link} from 'react-router-dom';

// step 1 of registration
function Step1({ firstName, setFirstName,
				   lastName, setLastName,
				   gender, setGender,
				   age, setAge,
				   email, setEmail,
				   password, setPassword,
				   AddStep,
			   	error, setError}) {

	const [genderError, setGenderError] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();

		// Check if gender is selected
		if (!gender) {
			setGenderError('Please select a gender');
			return; // Stop form submission
		} else {
			setGenderError('');
		}

		// If everything is valid, move to next step
		AddStep(e);
	};


	return (

		<form className='step-one' onSubmit={(e) => {
			// e.preventDefault();
			AddStep(e);
			// handleSubmit(e);
		}}
		autoComplete={"on"}
		>
			<div className='form-title'>
				<h1>Get started!</h1>
			</div>
			<div className={'line'}>
				<label id='first-name' className={'short'}>
					First name*
					<br/>
					<input
						type='text'
						id='first-name'
						placeholder='Enter your first name'
						className={`not-react-select short focus-highlight ${error ? 'error-border' : ''}`}
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						// required
						autoComplete={"on"}
					/>
				</label>
				<label id='last-name' className={'short'}>
					Last name*
					<br/>
					<input
						type='text'
						id='last-name'
						className={`not-react-select short focus-highlight ${error ? 'error-border' : ''}`}
						placeholder='Enter your last name'
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						// required
					/>
				</label>
			</div>
			<div className={'line'}>
				{/*todo make gender field required https://github.com/JedWatson/react-select/issues/3140*/}
				<label id='gender' className={'short'}>
					Gender*
					<br/>
					<Select
						className='basic-single short'
						classNamePrefix='select'
						menuWidth="short"
						isClearable={true}
						isSearchable={true}
						components={makeAnimated()}
						defaultValue={'Other'}
						name='gender'
						placeholder='Select gender'
						options={genderOptions}
						styles={customStyles}
						value={gender}
						onChange={setGender}
					/>
					{genderError && <p className="error-text">{genderError}</p>}
				</label>
				<label id='age' className={'short'}>
					Age*
					<br/>
					{/* todo custom field so increment and decrement buttons look better https://mui.com/base-ui/react-number-input/?srsltid=AfmBOoovlV0RQShKkZZdwfAY3yERi9pxgndUhHf-hAPsO6Noo8Tc3W_B*/}
					<input
						type='number'
						id='age'
						className={`not-react-select short focus-highlight ${error ? 'error-border' : ''}`}
						placeholder='Enter your age'
						value={age}
						onChange={(e) => setAge(e.target.value)}
						min={16}
						max={120}
						// required
					/>
				</label>
			</div>
			<div className={'line large'}>
				<label id='email'>
					Email address*
					<br/>
					<input
						type='email'
						id='email'
						className={`not-react-select focus-highlight ${error ? 'error-border' : ''}`}
						placeholder='Enter your email address'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						autoComplete={"on"}
						// required
					/>
				</label>
			</div>
			<div className={'line large'}>
				<label id='password'>
					Password*
					<br/>
					<input
						type='password'
						id='password'
						className={`not-react-select focus-highlight ${error ? 'error-border' : ''}`}
						placeholder='Enter a password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						autoComplete={"off"}
						// required
					/>
				</label>
			</div>
			{/*<div className={'line large'}>*/}
			{/*	/!* todo make sure password matches*!/*/}
			{/*	<label id='password-again'>*/}
			{/*		Password again**/}
			{/*		<br/>*/}
			{/*		<input*/}
			{/*			type='password'*/}
			{/*			id='password-again'*/}
			{/*			className={`${error ? 'error-border' : ''}`}*/}
			{/*			placeholder='Reenter the password'*/}
			{/*			value={password}*/}
			{/*			// onChange={(e) => setPassword(e.target.value)}*/}
			{/*			required*/}
			{/*		/>*/}
			{/*	</label>*/}
			{/*</div>*/}
			<label id='tc-label'>
				<input
					className='focus-highlight'
					type='checkbox'
					name='terms and conditions'
					id='tc-input'
					// required
				/>
				&nbsp;
				I agree to the terms and conditions*
			</label>
			<div className={'buttons-container'}>
				<label>
					<button
						className='next wide small'
						type={'submit'}
						// onClick={(e) => {
						// 	// e.preventDefault();
						// 	AddStep(e);
						// }}
					>
						Next
					</button>
				</label>
			</div>
		</form>
	);
}

export default Step1;