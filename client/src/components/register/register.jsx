import './register.scss'
import {useState} from 'react';
import Step1 from './register-step-1.jsx';
import Step2 from './register-step-2.jsx';
import Step3 from './register-step-3.jsx';
import Step4 from './register-step-4.jsx';
import Step5 from './register-step-5.jsx';
import Step6 from './register-step-6.jsx';
import { Cloudinary } from '@cloudinary/url-gen';
import { uploadToCloudinary } from '../utils/cloudinary';

import CloudinaryUploadWidget from '../utils/CloudinaryUploadWidget';
import {Link} from 'react-router-dom';
import axios from "axios";

export const handleCloseMenu = (selected) => {
	if (selected.length >= 3) {
		document.activeElement.blur()
	}
};


function Register() {
    // cloudinary code from: https://cloudinary.com/documentation/react_image_and_video_upload

    // Configuration
    const cloudName = 'hzxyensd5';
    const uploadPreset = 'aoh4fpwm';

    const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    // State
    const [publicId, setPublicId] = useState('');

    // Cloudinary configuration
    const cld = new Cloudinary({
        cloud: {
            cloudName,
        },
    });

    // Upload Widget Configuration
    const uwConfig = {
        cloudName,
        uploadPreset,
        // Uncomment and modify as needed:
        // cropping: true,
        // showAdvancedOptions: true,
        // sources: ['local', 'url'],
        // multiple: false,
        // folder: 'user_images',
        // tags: ['users', 'profile'],
        // context: { alt: 'user_uploaded' },
        // clientAllowedFormats: ['images'],
        // maxImageFileSize: 2000000,
        // maxImageWidth: 2000,
        // theme: 'purple',
    };

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
        rePassword: "",
    })

	// step 2 data
	const [formTwoData, setFormTwoData] = useState({
		preferredGenres: [],
		preferredMethods: [],
		additionalInterests: [],
		personalityTraits: [],
		goals: [],
	})

    // step 3 data
    const [formThreeData, setFormThreeData] = useState({
        experience: "",
        location: [],
        musicLink: "",
        description: "",
    })

    // step 4 data
    const [image, setImage] = useState(null)
    const [imageUrl, setImageUrl] = useState(null);

	// step 5 data
	const [formFiveData, setFormFiveData] = useState({
		matchPreferredGenres: [],
		matchPreferredMethods: [],
        matchGoals: [],
        matchGender: "",
        matchAge: "",
        matchExperience: "",
        matchLocation: "",
    })

	// Handle form submission
	const onSubmit = (data, form, setForm) => {
		setForm(data);
		console.log("Valid form data:", form);
		stepFunctions.AddStep();
	};


    const onImageChange = async (event) => {
        if (event.target.files && event.target.files[0]) {
            setImage(URL.createObjectURL(event.target.files[0])); // show local preview before upload

            // upload to cloudinary
            const uploadedUrl = await uploadToCloudinary(event.target.files[0]);
            if (uploadedUrl) {
                const publicId = uploadedUrl.split('/').pop().split('.')[0]; // Extract only the public ID
                setImageUrl(publicId); // Store only the Cloudinary image public ID
                console.log("Cloudinary image public ID:", publicId);
                /*setImageUrl(uploadedUrl); // store the uploaded image url
                console.log("Cloudinary image url:", uploadedUrl);*/
            } else {
                setError("Failed to upload image.");
            }
        }
    };

	function AddStep(e) {
		// e.preventDefault();
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
        const genderValue = formOneData.gender.value;
        const preferredMethodsValues = formTwoData.preferredMethods.map(item => item.value);
        const additionalInterestsValues = formTwoData.additionalInterests.map(item => item.value);
        const preferredMusicGenresValues = formTwoData.preferredGenres.map(item => item.value);
        const goalsWithMusicValues = formTwoData.goals.map(item => item.value);
        const personalityTraitsValues = formTwoData.personalityTraits.map(item => item.value);
        const idealMatchMethodsValues = formFiveData.matchPreferredMethods.map(item => item.value);
        const idealMatchGenresValues = formFiveData.matchPreferredGenres.map(item => item.value);
        const idealMatchGoalsValues = formFiveData.matchGoals.map(item => item.value);
        const idealMatchAgeValue = formFiveData.matchAge.value;
        const idealMatchLocationValue = formFiveData.matchLocation.value;
        const idealMatchYearsOfExperienceValue = formFiveData.matchExperience.value;
        const userDetails = {
            email: formOneData.email,
            password: formOneData.password,
            username: username,
            gender: genderValue,
            age: formOneData.age,
            profilePicture: imageUrl,
            preferredMethods: preferredMethodsValues,
            additionalInterests: additionalInterestsValues,
            preferredMusicGenres: preferredMusicGenresValues,
            goalsWithMusic: goalsWithMusicValues,
            personalityTraits: personalityTraitsValues,
            linkToMusic: formThreeData.musicLink,
            yearsOfMusicExperience: formThreeData.experience,
            description: formThreeData.description,
            location: formThreeData.location.label,
            idealMatchMethods: idealMatchMethodsValues,
            idealMatchGender: formFiveData.matchGender.value,
            idealMatchGenres: idealMatchGenresValues,
            idealMatchGoals: idealMatchGoalsValues,
            idealMatchAge: idealMatchAgeValue,
            idealMatchLocation: idealMatchLocationValue,
            idealMatchYearsOfExperience: idealMatchYearsOfExperienceValue
        };
        console.log("Sending:", JSON.stringify(userDetails, null, 2));
        try {
            const response = await
                axios.post(`${VITE_BACKEND_URL}/api/register`, userDetails);
            console.log("User created successfully");
        } catch (error) {
            if (error.response.status === 400) {
                console.log("Failed to register:", error.response.data);
            }
        }
    };


	return (

		<>
			{currentStep === 6 && (
				<Step6/>
			)}

			{currentStep !== 6 && (
			<div className='register-container'>

				{currentStep !== 6 &&
				(<div className={'exit-container'}>
					{/* again a tag to force rerender of nav bar*/}
					<Link to={'/'}>
						<button className={'button exit'}>Exit</button>
					</Link>
				</div>
				)}
				{currentStep !== 6 && (
				<div className={'account-creation'}>
					Account creation {currentStep}/6
				</div>
				)}
				<div className={'forms-container'}>
					{currentStep === 1 && (
						<Step1
							formOneData={formOneData}
							setFormOneData={setFormOneData}
							stepFunctions={stepFunctions}
							error={error} setError={setError}
							onSubmit={onSubmit}
						/>
					)}
					{currentStep === 2 && (
						<Step2
							formTwoData={formTwoData}
							setFormTwoData={setFormTwoData}
							onSubmit={onSubmit}
							stepFunctions={stepFunctions}
							handleCloseMenu={handleCloseMenu}
						/>
					)}
					{currentStep === 3 && (
						<Step3
							formThreeData={formThreeData}
							setFormThreeData={setFormThreeData}
							onSubmit={onSubmit}
							stepFunctions={stepFunctions}
							error={error} setError={setError}
							formOneData={formOneData}
						/>
					)}
					{currentStep === 4 && (
						<Step4
							image={image}
							imageUrl={imageUrl}
							stepFunctions={stepFunctions}
							onImageChange={onImageChange}
							onSubmit={onSubmit}
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
							onSubmit={onSubmit}
						/>
					)}
				</div>
				{currentStep === 1 && (
					<div id='have-account'>
						Already have an account?
						&nbsp;
						<Link to='/login' tabIndex={-1}>Sign in</Link>
					</div>
				)}
			</div>
			)}
		</>
		// </LoadScript>
	);
}

export default Register;
