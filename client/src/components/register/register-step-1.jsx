import Select from 'react-select';
import {genderOptions} from './inputOptions.jsx';
import {customStyles} from './customInputStyles.jsx';
import {useState} from 'react';
import makeAnimated from 'react-select/animated';
import axios from "axios";

function Step1({ formOneData, setFormOneData, handleChangeDataDefault, handleChangeDataReactSelect, stepFunctions, error, setError}) {

	const [genderError, setGenderError] = useState('');


	// validate inputs before moving to the next step
	// show errors if needed
	// todo input validation https://www.freecodecamp.org/news/how-to-validate-forms-in-react/#heading-how-to-implement-input-validation-in-react
	// https://www.npmjs.com/package/react-inputs-validation
	// make gender field required https://github.com/JedWatson/react-select/issues/3140
	// todo make sure password matches
	// todo make sure email is not already in use
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Check if gender is selected
		if (!formOneData.gender) {
			setGenderError('Please select a gender');
			return; // Stop form submission
		} else {
			setGenderError('');
		}

		// check if email is already in use in database
		try {
			const response = await
				axios.post("http://localhost:8080/check-email", {email: formOneData.email});
			if (response.data.exists) {
				console.log("Email already exists");
				setError("Email is already in use");
				return;
			} else {
				console.log("Email is not in use");
			}
		} catch (error) {
			console.log("Failed to request data from backend: ", error.response);
		}

		// If everything is valid, move to next step
		stepFunctions.AddStep(e);
	};

	// const validatePasswordMatch = (e) =>
	//
    //     if (password!== rePassword) {
    //         setError('Passwords do not match');
    //         console.error("Error: " + error);
    //     } else {
    //         validatePassword(e);
    //     }
	//
	// }

	const validatePasswordMatch = (e) => {

		if (formOneData.password!== formOneData.rePassword) {
			setError('Passwords do not match');
			console.error("Error: " + error);
		} else {
			setError('');
		}

	}

	const validatePassword = (e) => {
	    // todo implement password validation logic
		// password = e.target.value;
        // rePassword = document.getElementById('re-password').value;

		if (!formOneData.password && !formOneData.rePassword) {
			setError('');
            return; // Stop form submission
		}

        if (formOneData.password.length < 3) {
            setError('Password must be at least 3 characters long');
			console.error('Error: ' + error);
        } else if (!/[A-Z]/.test(formOneData.password)) {
            setError('Password must contain at least one uppercase letter');
			console.error("Error: " + error);
        } else if (!/[a-z]/.test(formOneData.password)) {
            setError('Password must contain at least one lowercase letter');
			console.error("Error: " + error);
        } else if (!/[0-9]/.test(formOneData.password)) {
            setError('Password must contain at least one number');
			console.error("Error: " + error);
        } else if (formOneData.password!== formOneData.rePassword) {
            setError('Passwords do not match');
			console.error("Error: " + error);
        } else {
            handleChangeDataDefault(e, setFormOneData)
			setError('');
			console.log("Password valid: " + formOneData.password);
        }

	}

	return (

		/*<form className='step-one' onSubmit={(e) => {
			// e.preventDefault();
			stepFunctions.AddStep(e);
			 // handleSubmit(e);
		}}
			  autoComplete={"on"}
		>*/
		<form className='step-one' onSubmit={handleSubmit} autoComplete="on">
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
						autoFocus={true}
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
						onChange={(e) => {
							console.log(e.target.value);
							handleChangeDataDefault(e, setFormOneData);
						}}
						// required
					/>
				</label>
			</div>
			<div className={'line'}>
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
						onChange={(e) => {
							 handleChangeDataDefault(e, setFormOneData);
							validatePassword()
						}}
						autoComplete={"off"}
						// required
					/>
				</label>
			</div>
			<div className={'line large'}>
				<label id='rePassword'>
					Re-enter password*
					<br/>
					<input
						type='password'
						id='rePassword'
						name={'rePassword'}
						className={`not-react-select focus-highlight ${error ? 'error-border' : ''}`}
						placeholder='Re-enter password'
						value={formOneData.rePassword}
						// onChange={(e) => setFormOneData.password(e.target.value)}
						onChange={(e) => {
							handleChangeDataDefault(e, setFormOneData);
							validatePasswordMatch()
						}}
						autoComplete={"off"}
						// required
					/>
				</label>
			</div>
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
			<div className={'error-container'} style={{height: "1rem", width:"100%", color: "red", fontSize: "0.8rem"}}>
                {error && <p className="error-text">{error}</p>}
            </div>
			<div className={'buttons-container'}>
				<label>
					<button
						className='next wide small'
						type={'submit'}
						// disabled={true}
					>
						Next
					</button>
				</label>
			</div>
		</form>
	);
}

export default Step1;
