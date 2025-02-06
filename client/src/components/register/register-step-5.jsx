
// step 5 of registration
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import {
	genreOptions,
	goalsOptions,
	matchAgeOptions,
	matchGenderOptions,
	matchExperienceOptions,
	methodsOptions, matchLocationsOptions
} from './inputOptions.jsx';
import {customStyles} from './customInputStyles.jsx';

const matchAgeToRange = (age) => {
	age = parseInt(age)
	return matchAgeOptions.find(option => {
		const [min, max] = option.value.split('-').map(Number);
		return age >= min && age <= max;
	});
};

const matchExperienceToRange = (experience) => {
	experience = parseInt(experience)
	return matchExperienceOptions.find(option => {
		const [min, max] = option.value.split('-').map(Number);
		return experience >= min && experience <= max;
	});
};

function Step5({formFiveData, setFormFiveData, formOneData, formTwoData, formThreeData, stepFunctions, Submit,
				   handleCloseMenu, handleChangeDataReactSelect, handleChangeDataDefault, error, setError}) {

	function handleAutoFillData(formFiveData, setFormFiveData, formThreeData, formTwoData, formOneData){
		setFormFiveData((prev) => ({
			...prev,
			matchPreferredGenres: formTwoData.preferredGenres, // Correctly set the genres as an array of objects
			matchPreferredMethods: formTwoData.preferredMethods, // Same for preferred methods
			matchGoals: formTwoData.goals, // Same for goals
			matchGender: formOneData.gender, // For React Select, use an object with value and label
			matchAge: matchAgeToRange(formOneData.age), // Match the age using predefined options
			matchExperience: matchExperienceToRange(formThreeData.experience), // Same for experience
			matchLocation: matchLocationsOptions[1], // Same for location
		}));
		console.log(formFiveData);
	}


	return (
		<form className={"step-five"}
			  onSubmit={(e) => {
				  stepFunctions.AddStep(e);
			  }}
			  autoComplete={"on"}
		>
			<div className='form-title'>
				<h1>Who are you looking for?</h1>
			</div>

			<div className={'like-me-container'}>
				<button
					className='like-me wide narrow'
					type='button'
					onClick={() => {handleAutoFillData(formFiveData, setFormFiveData, formThreeData, formTwoData, formOneData)}}
				>
					Someone like me
				</button>
			</div>

			<div className={'line large'}>
				<label id='matchPreferredGenres'>
					Which genres should they prefer?*
					<br/>
					<Select
						className='basic-multi-select long'
						classNamePrefix='select'
						components={makeAnimated()}
						closeMenuOnSelect={false}
						isClearable={true}
						isSearchable={true}
						isMulti={true}
						containerExpand={true}
						wideMenu={true}
						name={'matchPreferredGenres'}
						placeholder='Choose 1-3 genres'
						options={genreOptions}
						isOptionDisabled={() => formFiveData.matchPreferredGenres.length >= 3}
						styles={customStyles}
						value={formFiveData.matchPreferredGenres}
						onChange={(selectedOption) => {
							handleChangeDataReactSelect('matchPreferredGenres', selectedOption, setFormFiveData);
							handleCloseMenu(selectedOption);
						}}
					/>
				</label>

			</div>

			<div className={'line large'}>
				<label id='matchPreferredMethods'>
					How should they make music?*
					<br/>
					<Select
						className='basic-multi-select long'
						classNamePrefix='select'
						components={makeAnimated()}
						closeMenuOnSelect={false}
						isClearable={true}
						isSearchable={true}
						isMulti={true}
						containerExpand={true}
						wideMenu={true}
						name={'matchPreferredMethods'}
						placeholder='Choose 1-3 methods'
						options={methodsOptions}
						isOptionDisabled={() => formFiveData.matchPreferredMethods.length >= 3}
						styles={customStyles}
						value={formFiveData.matchPreferredMethods}
						onChange={(selectedOption) => {
							handleChangeDataReactSelect('matchPreferredMethods', selectedOption, setFormFiveData);
							handleCloseMenu(selectedOption);
						}}
					/>
				</label>
			</div>
			<div className={'line large'}>
				<label id='matchGoals'>
					What should their goals be?*
					<br/>
					<Select
						className='basic-multi-select long'
						classNamePrefix='select'
						components={makeAnimated()}
						closeMenuOnSelect={false}
						isClearable={true}
						isSearchable={true}
						isMulti={true}
						containerExpand={true}
						wideMenu={true}
						name={'matchGoals'}
						placeholder='Choose 1-3 goals'
						options={goalsOptions}
						styles={customStyles}
						value={formFiveData.matchGoals}
						isOptionDisabled={() => formFiveData.matchGoals.length >= 3}
						onChange={(selectedOption) => {
							handleChangeDataReactSelect('matchGoals', selectedOption, setFormFiveData);
							handleCloseMenu(selectedOption);
						}}
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
						name={"matchGender"}
						placeholder='Select gender'
						options={matchGenderOptions}
						styles={customStyles}
						value={formFiveData.matchGender}
						onChange={(selectedOption) => handleChangeDataReactSelect('matchGender', selectedOption, setFormFiveData)}
						// required
					/>
					{/*{genderError && <p className="error-text">{genderError}</p>}*/}
				</label>
				<label id='age' className={'short'}>
					Age*
					<br/>
					{/* todo custom field so increment and decrement buttons look better https://mui.com/base-ui/react-number-input/?srsltid=AfmBOoovlV0RQShKkZZdwfAY3yERi9pxgndUhHf-hAPsO6Noo8Tc3W_B*/}
					<Select
						className='basic-single short'
						classNamePrefix='select'
						menuWidth="short"
						isClearable={true}
						isSearchable={true}
						components={makeAnimated()}
						name={"matchAge"}
						placeholder='Select age gap'
						options={matchAgeOptions}
						styles={customStyles}
						value={formFiveData.matchAge}
						onChange={(selectedOption) => handleChangeDataReactSelect('matchAge', selectedOption, setFormFiveData)}
						// required
					/>
				</label>
			</div>

			<div className={'line'}>
				<label id='experience' className={'short'}>
					Years of music experience*
					<br/>
					<Select
						className='basic-single short'
						classNamePrefix='select'
						menuWidth="short"
						isClearable={true}
						isSearchable={true}
						components={makeAnimated()}
						name={"matchExperience"}
						placeholder='Select experience'
						options={matchExperienceOptions}
						styles={customStyles}
						value={formFiveData.matchExperience}
						onChange={(selectedOption) => handleChangeDataReactSelect('matchExperience', selectedOption, setFormFiveData)}
						// required
					/>
				</label>
				<label id='music' className={'short'}>
					Location*
					<br/>
					<Select
						className='basic-single short'
						classNamePrefix='select'
						menuWidth="short"
						isClearable={true}
						isSearchable={true}
						components={makeAnimated()}
						name={"matchLocation"}
						placeholder='Select proximity'
						options={matchLocationsOptions}
						styles={customStyles}
						value={formFiveData.matchLocation}
						onChange={(selectedOption) => handleChangeDataReactSelect('matchLocation', selectedOption, setFormFiveData)}
						// required
					/>
				</label>

			</div>

			<div className={'buttons-container'}>
				<button
					className='previous wide narrow'
					type={'button'}
					onClick={stepFunctions.DeductStep}>
					Previous
				</button>
				<button
					className='next wide narrow'
					type='submit'
					onClick={Submit}
				>
					Register
				</button>
			</div>
		</form>
	)
}

export default Step5;