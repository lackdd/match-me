import './register.scss'
import {useState} from 'react';
import {Link} from 'react-router-dom';
import Step1 from './register-step-1.jsx';
import Step2 from './register-step-2.jsx';


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
	const [goal, setGoal] = useState("")
	const [experience, setExperience] = useState("")
	const [location, setLocation] = useState("")
	const [musicLink, setMusicLink] = useState("")
	const [additionalInterests, setAdditionalInterests] = useState("")
	const [personalityTraits, setPersonalityTraits] = useState("")
	const [preferredMethods, setPreferredMethods] = useState("")
	const [preferredGenres, setPreferredGenres] = useState("")
	const [description, setDescription] = useState("")

	function AddStep(e) {
		e.preventDefault();
		setCurrentStep(currentStep + 1)
	}

	function DeductStep() {
		setCurrentStep(currentStep - 1)
	}

	return (
		<>
			<div className='register-container'>
				<div className={'exit-container'}>
					{/* again a tag to force rerender of nav bar*/}
					<Link to={'/'}>
						<button className={'button exit'}>Exit</button>
					</Link>
				</div>
				<div className={'account-creation'}>
					Account creation {currentStep}/5
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
							goal={goal} setGoal={setGoal}
							experience={experience} setExperience={setExperience}
							location={location} setLocation={setLocation}
							musicLink={musicLink} setMusicLink={setMusicLink}
							additionalInterests={additionalInterests} setAdditionalInterests={setAdditionalInterests}
							personalityTraits={personalityTraits} setPersonalityTraits={setPersonalityTraits}
							preferredMethods={preferredMethods} setPreferredMethods={setPreferredMethods}
							preferredGenres={preferredGenres} setPreferredGenres={setPreferredGenres}
							description={description} setDescription={setDescription}
							error={error} setError={setError}
							DeductStep={DeductStep} AddStep={AddStep}/>
					)}
				</div>
				<div id='have-account'>
					Already have an account?
					&nbsp;
					<Link to='/login'>Sign in</Link>
				</div>
			</div>
		</>

	);
}

export default Register;
