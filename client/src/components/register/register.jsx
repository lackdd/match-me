import './register.scss'
import {useState} from 'react';
import Step1 from './register-step-1.jsx';
import Step2 from './register-step-2.jsx';
import Step3 from './register-step-3.jsx';
import Step4 from './register-step-4.jsx';
import {isRouteErrorResponse, Link} from 'react-router-dom';
import axios from "axios";
import Step5 from './register-step-5.jsx';
import Step6 from './register-step-6.jsx';
import {LoadScript} from '@react-google-maps/api';

const GOOGLE_API_KEY = "***REMOVED***";
const libraries = ["places"];


// todo input validation https://www.freecodecamp.org/news/how-to-validate-forms-in-react/#heading-how-to-implement-input-validation-in-react
// https://www.npmjs.com/package/react-inputs-validation
function Register() {
	const [currentStep, setCurrentStep] = useState(1)
	const [error, setError] = useState('');

	// step 1 data
	const [firstName, setFirstName] = useState("")
	const [lastName, setLastName] = useState("")
	const [gender, setGender] = useState("")
	const [age, setAge] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

	// step 2 data
	const [additionalInterests, setAdditionalInterests] = useState("")
	const [personalityTraits, setPersonalityTraits] = useState("")
	const [preferredMethods, setPreferredMethods] = useState("")
	const [preferredGenres, setPreferredGenres] = useState("")

	// step 3 data
	const [goal, setGoal] = useState("")
	const [experience, setExperience] = useState("")
	const [location, setLocation] = useState("")
	const [country, setCountry] = useState("")
	const [city, setCity] = useState("")
	const [musicLink, setMusicLink] = useState("")
	const [description, setDescription] = useState("")

	// step 4 data
	const [image, setImage] = useState(null)

	const [isLoaded, setIsLoaded] = useState(false);

	const handleScriptLoad = () => {
		setIsLoaded(true);  // Set to true when the script is successfully loaded
	};


	const onImageChange = (event) => {
		if (event.target.files && event.target.files[0]) {
			setImage(URL.createObjectURL(event.target.files[0]));
		}
	}

	function AddStep(e) {
		e.preventDefault();
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

	// function Step1() {
	//
	//
	// 	return (
	//
	// 		<form className='step-one'>
	// 			<div className='form-title'>
	// 				<h1>Get started!</h1>
	// 			</div>
	// 			<div className={'line'}>
	// 				<label id='first-name-label' className={'short'}>
	// 					First name*
	// 					<br/>
	// 					<input
	// 						type='text'
	// 						id='first-name-input'
	// 						placeholder='Enter your first name'
	// 						className={`short ${error ? 'error-border' : ''}`}
	// 						value={firstName}
	// 						onChange={(e) => setFirstName(e.target.value)}
	// 						required
	// 					/>
	// 				</label>
	// 				<label id='last-name-label' className={'short'}>
	// 					Last name*
	// 					<br/>
	// 					<input
	// 						type='text'
	// 						id='last-name-input'
	// 						className={`short ${error ? 'error-border' : ''}`}
	// 						placeholder='Enter your last name'
	// 						value={lastName}
	// 						onChange={(e) => setLastName(e.target.value)}
	// 						required
	// 					/>
	// 				</label>
	// 			</div>
	// 			<div className={'line'}>
	// 				<label id='gender-label' className={'short'}>
	// 					Gender*
	// 					<br/>
	// 					<input
	// 						type='text'
	// 						id='gender-input'
	// 						className={`short ${error ? 'error-border' : ''}`}
	// 						placeholder='Enter your gender'
	// 						value={gender}
	// 						onChange={(e) => setGender(e.target.value)}
	// 						required
	// 					/>
	// 				</label>
	// 				<label id='age-label' className={'short'}>
	// 					Age*
	// 					<br/>
	// 					<input
	// 						type='number'
	// 						id='age-input'
	// 						className={`short ${error ? 'error-border' : ''}`}
	// 						placeholder='Enter your age'
	// 						value={age}
	// 						onChange={(e) => setAge(e.target.value)}
	// 						required
	// 					/>
	// 				</label>
	// 			</div>
	// 			<div className={'line large'}>
	// 				<label id='email-label'>
	// 					Email address*
	// 					<br/>
	// 					<input
	// 						type='email'
	// 						id='email-input'
	// 						className={`${error ? 'error-border' : ''}`}
	// 						placeholder='Enter your email address'
	// 						value={email}
	// 						onChange={(e) => setEmail(e.target.value)}
	// 						required
	// 					/>
	// 				</label>
	// 			</div>
	// 			<div className={'line large'}>
	// 				<label id='password-label'>
	// 					Password*
	// 					<br/>
	// 					<input
	// 						type='password'
	// 						id='password-input'
	// 						className={`${error ? 'error-border' : ''}`}
	// 						placeholder='Enter a password'
	// 						value={password}
	// 						onChange={(e) => setPassword(e.target.value)}
	// 						required
	// 					/>
	// 				</label>
	// 			</div>
	// 			<label id='tc-label'>
	// 				<input
	// 					type='checkbox'
	// 					name='terms and conditions'
	// 					id='tc-input'
	// 					required/>
	// 				&nbsp;
	// 				I agree to the terms and conditions*
	// 			</label>
	// 			<label>
	// 				<button
	// 					className='next wide small'
	// 					onClick={AddStep}>
	// 					Next
	// 				</button>
	// 				<button className='next wide small' onClick={Submit}>
	// 					Register
	// 				</button>
	// 			</label>
	// 		</form>
	// 	);
	// }


// 	function Step2() {
// /*		const [firstName, setFirstName] = useState("")
// 		const [lastName, setLastName] = useState("")
// 		const [gender, setGender] = useState("")
// 		const [age, setAge] = useState("")
// 		const [email, setEmail] = useState("")
// 		const [password, setPassword] = useState("")*/
//
// 		return (
//
// 			<form className='step-one'>
// 				<div className='form-title'>
// 					<h1>Get started!</h1>
// 				</div>
// 				<div className={'line'}>
// 					<label id='first-name-label' className={'short'}>
// 						First name*
// 						<br/>
// 						<input
// 							type='text'
// 							id='first-name-input'
// 							placeholder='Enter your first name'
// 							className={`short ${error ? 'error-border' : ''}`}
// 							value={firstName}
// 							onChange={(e) => setFirstName(e.target.value)}
// 							required
// 						/>
// 					</label>
// 					<label id='last-name-label' className={'short'}>
// 						Last name*
// 						<br/>
// 						<input
// 							type='text'
// 							id='last-name-input'
// 							className={`short ${error ? 'error-border' : ''}`}
// 							placeholder='Enter your last name'
// 							value={lastName}
// 							onChange={(e) => setLastName(e.target.value)}
// 							required
// 						/>
// 					</label>
// 				</div>
// 				<div className={'line'}>
// 					<label id='gender-label' className={'short'}>
// 						Gender*
// 						<br/>
// 						<input
// 							type='text'
// 							id='gender-input'
// 							className={`short ${error ? 'error-border' : ''}`}
// 							placeholder='Enter your gender'
// 							value={gender}
// 							onChange={(e) => setGender(e.target.value)}
// 							required
// 						/>
// 					</label>
// 					<label id='age-label' className={'short'}>
// 						Age*
// 						<br/>
// 						<input
// 							type='number'
// 							id='age-input'
// 							className={`short ${error ? 'error-border' : ''}`}
// 							placeholder='Enter your age'
// 							value={age}
// 							onChange={(e) => setAge(e.target.value)}
// 							required
// 						/>
// 					</label>
// 				</div>
// 				<div className={'line large'}>
// 					<label id='email-label'>
// 						Email address*
// 						<br/>
// 						<input
// 							type='email'
// 							id='email-input'
// 							className={`${error ? 'error-border' : ''}`}
// 							placeholder='Enter your email address'
// 							value={email}
// 							onChange={(e) => setEmail(e.target.value)}
// 							required
// 						/>
// 					</label>
// 				</div>
// 				<div className={'line large'}>
// 					<label id='password-label'>
// 						Password*
// 						<br/>
// 						<input
// 							type='password'
// 							id='password-input'
// 							className={`${error ? 'error-border' : ''}`}
// 							placeholder='Enter a password'
// 							value={password}
// 							onChange={(e) => setPassword(e.target.value)}
// 							required
// 						/>
// 					</label>
// 				</div>
// 				<label id='tc-label'>
// 					<input
// 						type='checkbox'
// 						name='terms and conditions'
// 						id='tc-input'
// 						required/>
// 					&nbsp;
// 					I agree to the terms and conditions*
// 				</label>
// 				<label>
// 					<button
// 						className='previous wide narrow'
// 						onClick={DeductStep}>
// 						Previous
// 					</button>
// 				</label>
// 				<label>
// 					<button
// 						className='next wide narrow'
// 						onClick={AddStep}>
// 						Next
// 					</button>
// 				</label>
// 			</form>
// 		);
// 	}


	return (
		<LoadScript googleMapsApiKey={GOOGLE_API_KEY} libraries={libraries}
					onLoad={handleScriptLoad}  // Call this when the script is loaded
			>
		<>
			<div className='register-container'>
				<div className={'exit-container'}>
					{/* again a tag to force rerender of nav bar*/}
					<Link to={'/'}>
						<button className={'button exit'}>Exit</button>
					</Link>
				</div>
				<div className={'account-creation'}>
					Account creation {currentStep}/6
				</div>
				<div className={'forms-container'}>
					{currentStep === 1 && (
						<Step1
							firstName={firstName} setFirstName={setFirstName}
							lastName={lastName} setLastName={setLastName}
							gender={gender} setGender={setGender}
							age={age} setAge={setAge}
							email={email} setEmail={setEmail}
							password={password} setPassword={setPassword}
							error={error} setError={setError}
							AddStep={AddStep}
						/>
					)}
					{currentStep === 2 && (
						<Step2
							additionalInterests={additionalInterests} setAdditionalInterests={setAdditionalInterests}
							personalityTraits={personalityTraits} setPersonalityTraits={setPersonalityTraits}
							preferredMethods={preferredMethods} setPreferredMethods={setPreferredMethods}
							preferredGenres={preferredGenres} setPreferredGenres={setPreferredGenres}
							error={error} setError={setError}
							goal={goal} setGoal={setGoal}
							DeductStep={DeductStep} AddStep={AddStep}/>
					)}
					{currentStep === 3 && (
						<Step3
							goal={goal} setGoal={setGoal}
							experience={experience} setExperience={setExperience}
							location={location} setLocation={setLocation}
							country={country} setCountry={setCountry}
							city={city} setCity={setCity}
							musicLink={musicLink} setMusicLink={setMusicLink}
							description={description} setDescription={setDescription}
							error={error} setError={setError}
							age={age}
							DeductStep={DeductStep} AddStep={AddStep}/>
					)}
					{currentStep === 4 && (
						<Step4
							DeductStep={DeductStep} AddStep={AddStep}
							onImageChange={onImageChange}
							image={image} setImage={setImage}
 							/>
					)}
					{currentStep === 5 && (
						<Step5
							DeductStep={DeductStep} AddStep={AddStep}
							Submit={Submit}/>
					)}
					{currentStep === 6 && (
						<Step6
							DeductStep={DeductStep} AddStep={AddStep}/>
					)}
				</div>
				{currentStep === 1 && (
					<div id='have-account'>
						Already have an account?
						&nbsp;
						<Link to='/login'>Sign in</Link>
					</div>
				)}
			</div>
		</>
		</LoadScript>
	);
}

export default Register;
