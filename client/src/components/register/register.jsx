import './register.scss'
import {useState} from 'react';
import {isRouteErrorResponse, Link} from 'react-router-dom';
import axios from "axios";

function Register() {
	const [currentStep, setCurrentStep] = useState(1)
	const [error, setError] = useState('');

	const [firstName, setFirstName] = useState("")
	const [lastName, setLastName] = useState("")
	const [gender, setGender] = useState("")
	const [age, setAge] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

	function AddStep() {
		setCurrentStep(currentStep + 1)
	}

	function DeductStep() {
		setCurrentStep(currentStep - 1)
	}

	const Submit = async () => {
		event.preventDefault();
		const username = firstName + " " + lastName;
		const userDetails = {email,  password, username,  gender,  age};
		try{
			const response = await
			axios.post("http://localhost:8080/register", userDetails);
			console.log("User created successfully");
		} catch (error) {
			console.log("Failed to register");
		}
	};

	function Step1() {


		return (

			<form className='step-one'>
				<div className='form-title'>
					<h1>Get started!</h1>
				</div>
				<div className={'line'}>
					<label id='first-name-label' className={'short'}>
						First name*
						<br/>
						<input
							type='text'
							id='first-name-input'
							placeholder='Enter your first name'
							className={`short ${error ? 'error-border' : ''}`}
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
							required
						/>
					</label>
					<label id='last-name-label' className={'short'}>
						Last name*
						<br/>
						<input
							type='text'
							id='last-name-input'
							className={`short ${error ? 'error-border' : ''}`}
							placeholder='Enter your last name'
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
							required
						/>
					</label>
				</div>
				<div className={'line'}>
					<label id='gender-label' className={'short'}>
						Gender*
						<br/>
						<input
							type='text'
							id='gender-input'
							className={`short ${error ? 'error-border' : ''}`}
							placeholder='Enter your gender'
							value={gender}
							onChange={(e) => setGender(e.target.value)}
							required
						/>
					</label>
					<label id='age-label' className={'short'}>
						Age*
						<br/>
						<input
							type='number'
							id='age-input'
							className={`short ${error ? 'error-border' : ''}`}
							placeholder='Enter your age'
							value={age}
							onChange={(e) => setAge(e.target.value)}
							required
						/>
					</label>
				</div>
				<div className={'line large'}>
					<label id='email-label'>
						Email address*
						<br/>
						<input
							type='email'
							id='email-input'
							className={`${error ? 'error-border' : ''}`}
							placeholder='Enter your email address'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</label>
				</div>
				<div className={'line large'}>
					<label id='password-label'>
						Password*
						<br/>
						<input
							type='password'
							id='password-input'
							className={`${error ? 'error-border' : ''}`}
							placeholder='Enter a password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</label>
				</div>
				<label id='tc-label'>
					<input
						type='checkbox'
						name='terms and conditions'
						id='tc-input'
						required/>
					&nbsp;
					I agree to the terms and conditions*
				</label>
				<label>
					<button
						className='next wide small'
						onClick={AddStep}>
						Next
					</button>
					<button className='next wide small' onClick={Submit}>
						Register
					</button>
				</label>
			</form>
		);
	}


	function Step2() {
/*		const [firstName, setFirstName] = useState("")
		const [lastName, setLastName] = useState("")
		const [gender, setGender] = useState("")
		const [age, setAge] = useState("")
		const [email, setEmail] = useState("")
		const [password, setPassword] = useState("")*/

		return (

			<form className='step-one'>
				<div className='form-title'>
					<h1>Get started!</h1>
				</div>
				<div className={'line'}>
					<label id='first-name-label' className={'short'}>
						First name*
						<br/>
						<input
							type='text'
							id='first-name-input'
							placeholder='Enter your first name'
							className={`short ${error ? 'error-border' : ''}`}
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
							required
						/>
					</label>
					<label id='last-name-label' className={'short'}>
						Last name*
						<br/>
						<input
							type='text'
							id='last-name-input'
							className={`short ${error ? 'error-border' : ''}`}
							placeholder='Enter your last name'
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
							required
						/>
					</label>
				</div>
				<div className={'line'}>
					<label id='gender-label' className={'short'}>
						Gender*
						<br/>
						<input
							type='text'
							id='gender-input'
							className={`short ${error ? 'error-border' : ''}`}
							placeholder='Enter your gender'
							value={gender}
							onChange={(e) => setGender(e.target.value)}
							required
						/>
					</label>
					<label id='age-label' className={'short'}>
						Age*
						<br/>
						<input
							type='number'
							id='age-input'
							className={`short ${error ? 'error-border' : ''}`}
							placeholder='Enter your age'
							value={age}
							onChange={(e) => setAge(e.target.value)}
							required
						/>
					</label>
				</div>
				<div className={'line large'}>
					<label id='email-label'>
						Email address*
						<br/>
						<input
							type='email'
							id='email-input'
							className={`${error ? 'error-border' : ''}`}
							placeholder='Enter your email address'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</label>
				</div>
				<div className={'line large'}>
					<label id='password-label'>
						Password*
						<br/>
						<input
							type='password'
							id='password-input'
							className={`${error ? 'error-border' : ''}`}
							placeholder='Enter a password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</label>
				</div>
				<label id='tc-label'>
					<input
						type='checkbox'
						name='terms and conditions'
						id='tc-input'
						required/>
					&nbsp;
					I agree to the terms and conditions*
				</label>
				<label>
					<button
						className='previous wide narrow'
						onClick={DeductStep}>
						Previous
					</button>
				</label>
				<label>
					<button
						className='next wide narrow'
						onClick={AddStep}>
						Next
					</button>
				</label>
			</form>
		);
	}


	return (
		<>
			<div className='register-container'>
				<div className={'exit-container'}>
					{/* again a tag to force rerender of nav bar*/}
					<a href={'/'}>
						<button className={'button exit'}>Exit</button>
					</a>
				</div>
				<div className={'account-creation'}>
					Account creation {currentStep}/5
				</div>
				<div className={'forms-container'}>
					{currentStep === 1 && <Step1/>}
					{currentStep === 2 && <Step2/>}
					{currentStep === 3 && <Step3/>}
					{currentStep === 4 && <Step4/>}
					{currentStep === 5 && <Step5/>}
				</div>
				<div id='no-account-label'>
					Already have an account
					&nbsp;
					<Link to='/login'>Sign in</Link>
				</div>
			</div>
		</>

	);
}

export default Register;
