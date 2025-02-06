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

const GOOGLE_API_KEY = "***REMOVED***";
const libraries = ["places"];

// todo input validation https://www.freecodecamp.org/news/how-to-validate-forms-in-react/#heading-how-to-implement-input-validation-in-react
// https://www.npmjs.com/package/react-inputs-validation
function Register() {
	const [currentStep, setCurrentStep] = useState(1)
	const [error, setError] = useState('');

	// step 1 data
	const [formOneData, setFormOneData] = useState({
		firstName: "",
        lastName: "",
        gender: "",
        age: "",
        email: "",
        password: "",
	})


	// step 2 data
	const [formTwoData, setFormTwoData] = useState({
		additionalInterests: "",
		personalityTraits: "",
        preferredMethods: "",
        preferredGenres: "",
		goals: "",
	})


	// step 3 data
	const [formThreeData, setFormThreeData] = useState({
        experience: "",
        location: "",
        musicLink: "",
        description: "",
	})

	// step 4 data
	const [image, setImage] = useState(null)

	// step 5 data
	const [formFiveData, setFormFiveData] = useState({
		matchPreferredGenres: "",
		matchPreferredMethods: "",
        matchGoals: "",
        matchGender: "",
        matchAge: "",
		matchExperience: "",
        matchLocation: "",
	})

	// const [isLoaded, setIsLoaded] = useState(false);
	//
	// const handleScriptLoad = () => {
	// 	setIsLoaded(true);  // Set to true when the script is successfully loaded
	// };

	const handleCloseMenu = (selected) => {
		if (selected.length >= 3) {
			document.activeElement.blur()
		}
	};


	const handleChangeDataReactSelect = (name, value, setData) => {
		setData((prev) => ({
			...prev,
			[name]: value // Store name and value properly
		}));
	};

	const handleChangeDataDefault = (e, setData) => {
		const { name, value } = e.target;
		setData((prev) => ({
			...prev,
			[name]: value // Store name and value properly
		}));
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

	const stepFunctions = {AddStep: AddStep, DeductStep: DeductStep}

	const Submit = async () => {
		setCurrentStep(currentStep + 1)
		event.preventDefault();
		const username = formOneData.firstName + " " + formOneData.lastName;
		const userDetails = {email: formOneData.email, pw: formOneData.password, username: username,  gender: formOneData.gender,  age: formOneData.age};
		try{
			const response = await
			axios.post("http://localhost:8080/register", userDetails);
			console.log("User created successfully");
		} catch (error) {
			console.log("Failed to register");
		}
	};


	return (
		// <LoadScript googleMapsApiKey={GOOGLE_API_KEY} libraries={libraries}
		// 			onLoad={handleScriptLoad}  // Call this when the script is loaded
		// 	>
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
							formOneData={formOneData}
							setFormOneData={setFormOneData}
							handleChangeDataDefault={handleChangeDataDefault}
							handleChangeDataReactSelect={handleChangeDataReactSelect}
							stepFunctions={stepFunctions}
							error={error} setError={setError}
						/>
					)}
					{currentStep === 2 && (
						<Step2
							formTwoData={formTwoData}
							setFormTwoData={setFormTwoData}
							handleChangeDataReactSelect={handleChangeDataReactSelect}
							stepFunctions={stepFunctions}
							handleCloseMenu={handleCloseMenu}
						/>
					)}
					{currentStep === 3 && (
						<Step3
							formThreeData={formThreeData}
							setFormThreeData={setFormThreeData}
							handleChangeDataDefault={handleChangeDataDefault}
							handleChangeDataReactSelect={handleChangeDataReactSelect}
							stepFunctions={stepFunctions}
							error={error} setError={setError}
						/>
					)}
					{currentStep === 4 && (
						<Step4
							image={image}
							stepFunctions={stepFunctions}
							onImageChange={onImageChange}
 							/>
					)}
					{currentStep === 5 && (
						<Step5
							stepFunctions={stepFunctions}
							Submit={Submit}
							formFiveData={formFiveData}
							setFormFiveData={setFormFiveData}
							formOneData={formOneData}
							formTwoData={formTwoData}
							formThreeData={formThreeData}
							handleCloseMenu={handleCloseMenu}
							handleChangeDataDefault={handleChangeDataDefault}
							handleChangeDataReactSelect={handleChangeDataReactSelect}
						/>
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
		// </LoadScript>
	);
}

export default Register;
