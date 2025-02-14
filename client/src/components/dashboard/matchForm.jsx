import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {stepFiveSchema} from '../register/validationSchema.jsx';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import {
	genreOptions,
	goalsOptions,
	matchAgeOptions, matchExperienceOptions,
	matchGenderOptions, matchLocationsOptions,
	methodsOptions
} from '../register/inputOptions.jsx';
import {customStyles} from '../register/customInputStyles.jsx';
import {handleCloseMenu} from '../register/register.jsx';
import React from 'react';

export function MatchForm() {
	// Initialize react-hook-form with Yup schema
	const {
		handleSubmit,
		setValue,
		watch,
		clearErrors,
		setError,
		trigger,
		formState: { errors },
	} = useForm({
		defaultValues: {
			matchPreferredGenres: [],
			matchPreferredMethods: [],
			matchGoals: [],
			matchGender: "",
			matchAge: "",
			matchExperience: "",
			matchLocation: "",
		},
		resolver: yupResolver(stepFiveSchema),
		mode: "onBlur",
	});

	return (
		<form className={'dashboard-matches'}
			  onSubmit={handleSubmit(async (data) => {
				  // await onSubmit(data, formFiveData, setFormFiveData);
				  await Submit(); // Send the data to the database after onSubmit is done
			  })}
			  autoComplete={'off'}
			  noValidate
		>
			<div className='form-title'>
				<h1>Interested in</h1>
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
						isOptionDisabled={() => (watch('matchPreferredGenres') || []).length >= 3}
						styles={customStyles}
						value={watch('matchPreferredGenres') || []}
						isValid={!errors.matchPreferredGenres && (watch('matchPreferredGenres') || []).length > 0}
						isError={errors.matchPreferredGenres} // Check if error exists
						onChange={(selectedOption) => {
							setValue('matchPreferredGenres', selectedOption, {shouldValidate: true});
							// setFormFiveData((prev) => ({...prev, matchPreferredGenres: selectedOption})); // Persist data correctly
							handleCloseMenu(selectedOption);

							if (!selectedOption || selectedOption.length === 0) {
								setError('matchPreferredGenres', {message: 'Required'});
							} else {
								clearErrors('matchPreferredGenres');
							}
						}}
						onBlur={() => trigger('matchPreferredGenres')} // Trigger validation when user leaves the field
					/>
					{/*<ErrorElement errors={errors}  id={'matchPreferredGenres'}/>*/}
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
						isOptionDisabled={() => (watch('matchPreferredMethods') || []).length >= 3}
						styles={customStyles}
						value={watch('matchPreferredMethods') || []}
						isValid={!errors.matchPreferredMethods && (watch('matchPreferredMethods') || []).length > 0}
						isError={errors.matchPreferredMethods} // Check if error exists
						onChange={(selectedOption) => {
							setValue('matchPreferredMethods', selectedOption, {shouldValidate: true});
							// setFormFiveData((prev) => ({...prev, matchPreferredMethods: selectedOption})); // Persist data correctly
							handleCloseMenu(selectedOption);

							if (!selectedOption || selectedOption.length === 0) {
								setError('matchPreferredMethods', {message: 'Required'});
							} else {
								clearErrors('matchPreferredMethods');
							}
						}}
						onBlur={() => trigger('matchPreferredMethods')} // Trigger validation when user leaves the field
					/>
					{/*<ErrorElement errors={errors}  id={'matchPreferredMethods'}/>*/}
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
						isOptionDisabled={() => (watch('matchGoals') || []).length >= 3}
						styles={customStyles}
						value={watch('matchGoals') || []}
						isValid={!errors.matchGoals && (watch('matchGoals') || []).length > 0}
						isError={errors.matchGoals} // Check if error exists
						onChange={(selectedOption) => {
							setValue('matchGoals', selectedOption, {shouldValidate: true});
							// setFormFiveData((prev) => ({...prev, matchGoals: selectedOption})); // Persist data correctly
							handleCloseMenu(selectedOption);

							if (!selectedOption || selectedOption.length === 0) {
								setError('matchGoals', {message: 'Required'});
							} else {
								clearErrors('matchGoals');
							}
						}}
						onBlur={() => trigger('matchGoals')} // Trigger validation when user leaves the field
					/>
					{/*<ErrorElement errors={errors}  id={'matchGoals'}/>*/}
				</label>
			</div>
			<div className={'line'}>
				<label id='gender' className={'short'}>
					Gender*
					<br/>
					<Select
						className='basic-single short'
						classNamePrefix='select'
						menuWidth='short'
						isClearable={true}
						isSearchable={true}
						components={makeAnimated()}
						name={'matchGender'}
						placeholder='Select gender'
						options={matchGenderOptions}
						styles={customStyles}
						value={watch('matchGender') || []}
						isValid={!errors.matchGender && watch('matchGender')}
						isError={errors.matchGender} // Check if error exists
						onChange={(selectedOption) => {
							setValue('matchGender', selectedOption, {shouldValidate: true});

							if (!selectedOption || Object.keys(selectedOption).length === 0) {
								setError('matchGender', {message: 'Required'});
							} else {
								clearErrors('matchGender');
							}
						}}
						onBlur={() => trigger('matchGender')} // Trigger validation when user leaves the field
					/>
					{/*<ErrorElement errors={errors}  id={'matchGender'}/>*/}
				</label>
				<label id='age' className={'short'}>
					Age*
					<br/>
					<Select
						className='basic-single short'
						classNamePrefix='select'
						menuWidth='short'
						isClearable={true}
						isSearchable={true}
						components={makeAnimated()}
						name={'matchAge'}
						placeholder='Select age gap'
						options={matchAgeOptions}
						styles={customStyles}
						value={watch('matchAge') || []}
						isValid={!errors.matchAge && watch('matchAge')}
						isError={errors.matchAge} // Check if error exists
						onChange={(selectedOption) => {
							setValue('matchAge', selectedOption, {shouldValidate: true});
							// setFormFiveData((prev) => ({...prev, matchAge: selectedOption})); // Persist data correctly

							if (!selectedOption || Object.keys(selectedOption).length === 0) {
								setError('matchAge', {message: 'Required'});
							} else {
								clearErrors('matchAge');
							}
						}}
						onBlur={() => trigger('matchAge')} // Trigger validation when user leaves the field
					/>
					{/*<ErrorElement errors={errors}  id={'matchAge'}/>*/}
				</label>
			</div>

			<div className={'line'}>
				<label id='experience' className={'short'}>
					Years of music experience*
					<br/>
					<Select
						className='basic-single short'
						classNamePrefix='select'
						menuWidth='short'
						isClearable={true}
						isSearchable={true}
						components={makeAnimated()}
						name={'matchExperience'}
						placeholder='Select experience'
						options={matchExperienceOptions}
						styles={customStyles}
						value={watch('matchExperience') || []}
						isValid={!errors.matchExperience && watch('matchExperience')}
						isError={errors.matchExperience} // Check if error exists
						onChange={(selectedOption) => {
							setValue('matchExperience', selectedOption, {shouldValidate: true});
							// setFormFiveData((prev) => ({...prev, matchExperience: selectedOption})); // Persist data correctly

							if (!selectedOption || Object.keys(selectedOption).length === 0) {
								setError('matchExperience', {message: 'Required'});
							} else {
								clearErrors('matchExperience');
							}
						}}
						onBlur={() => trigger('matchExperience')} // Trigger validation when user leaves the field
					/>
					{/*<ErrorElement errors={errors}  id={'matchExperience'}/>*/}
				</label>
				<label id='location' className={'short'}>
					Location*
					<br/>
					<Select
						className='basic-single short'
						classNamePrefix='select'
						menuWidth='short'
						isClearable={true}
						isSearchable={true}
						components={makeAnimated()}
						name={'matchLocation'}
						placeholder='Select proximity'
						options={matchLocationsOptions}
						styles={customStyles}
						value={watch('matchLocation') || []}
						isValid={!errors.matchLocation && watch('matchLocation')}
						isError={errors.matchLocation} // Check if error exists
						onChange={(selectedOption) => {
							setValue('matchLocation', selectedOption, {shouldValidate: true});
							// setFormFiveData((prev) => ({...prev, matchLocation: selectedOption})); // Persist data correctly

							if (!selectedOption || Object.keys(selectedOption).length === 0) {
								setError('matchLocation', {message: 'Required'});
							} else {
								clearErrors('matchLocation');
							}
						}}
						onBlur={() => trigger('matchLocation')} // Trigger validation when user leaves the field
					/>
					{/*<ErrorElement errors={errors}  id={'matchLocation'}/>*/}
				</label>

			</div>
		</form>
	)
}