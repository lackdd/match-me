import {genreOptions, methodsOptions, interestsOptions, personalityTraitsOptions, goalsOptions} from './inputOptions.jsx';
import {customStyles} from './customInputStyles.jsx';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import {useRef} from 'react';

// step 2 of registration
function Step2({additionalInterests, setAdditionalInterests,
               personalityTraits, setPersonalityTraits,
               preferredMethods, setPreferredMethods,
			   preferredGenres, setPreferredGenres,
               DeductStep, AddStep,
				   goal, setGoal,
			   error, setError}) {

	// const selectRef = useRef(null);

	const handleCloseMenu = (selected) => {
		console.log(selected.length);
		if (selected.length >= 3) {
			// selectRef.current.blur();
			document.activeElement.blur()
		}
	};

	return (

		<form className='step-two'
			  onSubmit={(e) => {
				  AddStep(e);
			  }}
			  autoComplete={"on"}>

			<div className='form-title'>
				<h1>Tell us about yourself</h1>
			</div>

			<div className={'line large'}>
				<label id='genres'>
					Preferred music genres*
					<br/>
					{/*<input*/}
					{/*	type='text'*/}
					{/*	id='genres'*/}
					{/*	className={`focus-highlight ${error ? 'error-border' : ''}`}*/}
					{/*	placeholder='Choose 1-3 genres'*/}
					{/*	value={preferredGenres}*/}
					{/*	onChange={(e) => setPreferredGenres(e.target.value)}*/}
					{/*	// required*/}
					{/*/>*/}
					<Select
						// ref={selectRef}
						className='basic-multi-select long'
						classNamePrefix='select'
						components={makeAnimated()}
						closeMenuOnSelect={false}
						isClearable={true}
						isSearchable={true}
						isMulti={true}
						containerExpand={true}
						wideMenu={true}
						defaultValue={'Other'}
						name='genres'
						placeholder='Choose 1-3 genres'
						options={genreOptions}
						isOptionDisabled={() => preferredGenres.length >= 3}
						styles={customStyles}
						value={preferredGenres}
						onChange={(selected) => {
							setPreferredGenres(selected);
							handleCloseMenu(selected);
							// if (selected.length >= 3 && selectRef.current) {
							// 	selectRef.current.blur();
							// }
						}}
					/>
				</label>

			</div>

			<div className={'line large'}>
				<label id='methods'>
					Preferred methods*
					<br/>
					{/*<input*/}
					{/*	type='text'*/}
					{/*	id='methods'*/}
					{/*	className={`focus-highlight ${error ? 'error-border' : ''}`}*/}
					{/*	placeholder='Choose 1-3 methods'*/}
					{/*	value={preferredMethods}*/}
					{/*	onChange={(e) => setPreferredMethods(e.target.value)}*/}
					{/*	// required*/}
					{/*/>*/}
					<Select
						// ref={selectRef}
						className='basic-multi-select long'
						classNamePrefix='select'
						components={makeAnimated()}
						closeMenuOnSelect={false}
						isClearable={true}
						isSearchable={true}
						isMulti={true}
						containerExpand={true}
						wideMenu={true}
						defaultValue={'Other'}
						name='methods'
						placeholder='Choose 1-3 methods'
						options={methodsOptions}
						isOptionDisabled={() => preferredMethods.length >= 3}
						styles={customStyles}
						value={preferredMethods}
						onChange={(selected) => {
							setPreferredMethods(selected);
							handleCloseMenu(selected);
							// if (selected.length >= 3 && selectRef.current) {
							// 	selectRef.current.blur();
							// }
						}}
					/>
				</label>
			</div>

			<div className={'line large'}>
				<label id='interests'>
					Additional interests*
					<br/>
					{/*<input*/}
					{/*	type='text'*/}
					{/*	id='interests'*/}
					{/*	className={`focus-highlight ${error ? 'error-border' : ''}`}*/}
					{/*	placeholder='Choose 1-3 interests'*/}
					{/*	value={additionalInterests}*/}
					{/*	onChange={(e) => setAdditionalInterests(e.target.value)}*/}
					{/*	// required*/}
					{/*/>*/}
					<Select
						// ref={selectRef}
						className='basic-multi-select long'
						classNamePrefix='select'
						components={makeAnimated()}
						closeMenuOnSelect={false}
						isClearable={true}
						isSearchable={true}
						isMulti={true}
						containerExpand={true}
						wideMenu={true}
						defaultValue={'Other'}
						name='interests'
						placeholder='Choose 1-3 interests'
						options={interestsOptions}
						isOptionDisabled={() => additionalInterests.length >= 3}
						styles={customStyles}
						value={additionalInterests}
						onChange={(selected) => {
							setAdditionalInterests(selected);
							handleCloseMenu(selected);
							// if (selected.length >= 3 && selectRef.current) {
							// 	selectRef.current.blur();
							// }
						}}
					/>
				</label>
			</div>

			<div className={'line large'}>
				<label id='personality'>
					Personality traits*
					<br/>
					{/*<input*/}
					{/*	type='text'*/}
					{/*	id='personality'*/}
					{/*	className={`focus-highlight ${error ? 'error-border' : ''}`}*/}
					{/*	placeholder='Choose 1-3 traits'*/}
					{/*	value={personalityTraits}*/}
					{/*	onChange={(e) => setPersonalityTraits(e.target.value)}*/}
					{/*	// required*/}
					{/*/>*/}
					<Select
						// ref={selectRef}
						className='basic-multi-select long'
						classNamePrefix='select'
						components={makeAnimated()}
						closeMenuOnSelect={false}
						isClearable={true}
						isSearchable={true}
						isMulti={true}
						containerExpand={true}
						wideMenu={true}
						defaultValue={'Other'}
						name='interests'
						placeholder='Choose 1-3 traits'
						options={personalityTraitsOptions}
						isOptionDisabled={() => personalityTraits.length >= 3}
						styles={customStyles}
						value={personalityTraits}
						onChange={(selected) => {
							setPersonalityTraits(selected);
							console.log(personalityTraits);
							handleCloseMenu(selected);
							// if (selected.length >= 3 && selectRef.current) {
							// 	selectRef.current.blur();
							// }
						}}
						on
					/>
				</label>
			</div>
			<div className={'line large'}>
				<label id='goal'>
					What are your goals with music?*
					<br/>
					<Select
						// ref={selectRef}
						className='basic-multi-select long'
						classNamePrefix='select'
						components={makeAnimated()}
						closeMenuOnSelect={false}
						isClearable={true}
						isSearchable={true}
						isMulti={true}
						containerExpand={true}
						wideMenu={true}
						defaultValue={'Other'}
						name='goals'
						placeholder='Choose 1-3 goals'
						options={goalsOptions}
						styles={customStyles}
						value={goal}
						isOptionDisabled={() => goal.length >= 3}
						onChange={(selected) => {
							setGoal(selected);
							console.log(goal);
							handleCloseMenu(selected);
						}}
					/>
				</label>
			</div>

			<div className={'buttons-container'}>
				{/*<label>*/}
				<button
					className='previous wide narrow'
					type={'button'}
					onClick={DeductStep}>
					Previous
				</button>
				{/*</label>*/}
				{/*<label>*/}
				<button
					className='next wide narrow'
					type={'submit'}
					// onClick={AddStep}
				>
					Next
				</button>
				{/*</label>*/}
			</div>
		</form>
	);
}

export default Step2;