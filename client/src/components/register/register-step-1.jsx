import Select from 'react-select';
import {genderOptions} from './inputOptions.jsx';
import {customStyles} from './customInputStyles.jsx';
import {useState} from 'react';
import makeAnimated from 'react-select/animated';

function Step1({ formOneData, setFormOneData, handleChangeDataDefault, handleChangeDataReactSelect, stepFunctions, error, setError}) {

	const [genderError, setGenderError] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();

		// Check if gender is selected
		if (!formOneData.gender) {
			setGenderError('Please select a gender');
			return; // Stop form submission
		} else {
			setGenderError('');
		}

		// If everything is valid, move to next step
		stepFunctions.AddStep(e);
	};


	return (

		<form className='step-one' onSubmit={(e) => {
			// e.preventDefault();
			stepFunctions.AddStep(e);
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
						name={"firstName"}
						placeholder='Enter your first name'
						className={`not-react-select short focus-highlight ${error ? 'error-border' : ''}`}
						value={formOneData.firstName}
						onChange={(e) => handleChangeDataDefault(e, setFormOneData)}
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
						name={"lastName"}
						className={`not-react-select short focus-highlight ${error ? 'error-border' : ''}`}
						placeholder='Enter your last name'
						value={formOneData.lastName}
						onChange={(e) => handleChangeDataDefault(e, setFormOneData)}
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
						name={"gender"}
						placeholder='Select gender'
						options={genderOptions}
						styles={customStyles}
						value={formOneData.gender}
						onChange={(selectedOption) => handleChangeDataReactSelect('gender', selectedOption, setFormOneData)}
						// required
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
						name={'age'}
						className={`not-react-select short focus-highlight ${error ? 'error-border' : ''}`}
						placeholder='Enter your age'
						value={formOneData.age}
						onChange={(e) => handleChangeDataDefault(e, setFormOneData)}
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
						name={'email'}
						className={`not-react-select focus-highlight ${error ? 'error-border' : ''}`}
						placeholder='Enter your email address'
						value={formOneData.email}
						// onChange={(e) => setFormOneData.email(e.target.value)}
						onChange={(e) => handleChangeDataDefault(e, setFormOneData)}
						// required
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
						name={'password'}
						className={`not-react-select focus-highlight ${error ? 'error-border' : ''}`}
						placeholder='Enter a password'
						value={formOneData.password}
						// onChange={(e) => setFormOneData.password(e.target.value)}
						onChange={(e) => handleChangeDataDefault(e, setFormOneData)}
						autoComplete={"off"}
						// required
					/>
				</label>
			</div>
			{/*	/!* todo make sure password matches*!/*/}
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
					>
						Next
					</button>
				</label>
			</div>
		</form>
	);
}

export default Step1;