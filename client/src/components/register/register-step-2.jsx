import {genreOptions, methodsOptions, interestsOptions, personalityTraitsOptions, goalsOptions} from './inputOptions.jsx';
import {customStyles} from './customInputStyles.jsx';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';


function Step2({formTwoData, setFormTwoData, stepFunctions, handleChangeDataReactSelect, handleCloseMenu, error, setError}) {

	return (

		<form className='step-two'
			  onSubmit={(e) => {
				  stepFunctions.AddStep(e);
			  }}
			  autoComplete={"on"}>

			<div className='form-title'>
				<h1>Tell us about yourself</h1>
			</div>

			<div className={'line large'}>
				<label id='genres'>
					Preferred music genres*
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
						name={'preferredGenres'}
						required
						placeholder='Choose 1-3 genres'
						options={genreOptions}
						isOptionDisabled={() => formTwoData.preferredGenres.length >= 3}
						styles={customStyles}
						value={formTwoData.preferredGenres}
						autoFocus={true}
						onChange={(selectedOption) => {
							handleChangeDataReactSelect('preferredGenres', selectedOption, setFormTwoData);
							handleCloseMenu(selectedOption);
						}}
					/>
				</label>

			</div>

			<div className={'line large'}>
				<label id='methods'>
					Preferred methods*
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
						name={'preferredMethods'}
						placeholder='Choose 1-3 methods'
						options={methodsOptions}
						isOptionDisabled={() => formTwoData.preferredMethods.length >= 3}
						styles={customStyles}
						value={formTwoData.preferredMethods}
						onChange={(selectedOption) => {
							handleChangeDataReactSelect('preferredMethods', selectedOption, setFormTwoData);
							handleCloseMenu(selectedOption);
						}}
					/>
				</label>
			</div>

			<div className={'line large'}>
				<label id='interests'>
					Additional interests*
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
						name={'additionalInterests'}
						placeholder='Choose 1-3 interests'
						options={interestsOptions}
						isOptionDisabled={() => formTwoData.additionalInterests.length >= 3}
						styles={customStyles}
						value={formTwoData.additionalInterests}
						onChange={(selectedOption) => {
							handleChangeDataReactSelect('additionalInterests', selectedOption, setFormTwoData);
							handleCloseMenu(selectedOption);
						}}
					/>
				</label>
			</div>

			<div className={'line large'}>
				<label id='personality'>
					Personality traits*
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
						name={'personalityTraits'}
						placeholder='Choose 1-3 traits'
						options={personalityTraitsOptions}
						isOptionDisabled={() => formTwoData.personalityTraits.length >= 3}
						styles={customStyles}
						value={formTwoData.personalityTraits}
						onChange={(selectedOption) => {
							handleChangeDataReactSelect('personalityTraits', selectedOption, setFormTwoData);
							handleCloseMenu(selectedOption);
						}}
					/>
				</label>
			</div>
			<div className={'line large'}>
				<label id='goal'>
					What are your goals with music?*
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
						name={'goals'}
						placeholder='Choose 1-3 goals'
						options={goalsOptions}
						styles={customStyles}
						value={formTwoData.goals}
						isOptionDisabled={() => formTwoData.goals.length >= 3}
						onChange={(selectedOption) => {
							handleChangeDataReactSelect('goals', selectedOption, setFormTwoData);
							handleCloseMenu(selectedOption);
						}}
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
					type={'submit'}
				>
					Next
				</button>
			</div>
		</form>
	);
}

export default Step2;