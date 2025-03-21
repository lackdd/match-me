
// step 5 of registration
import Select, {mergeStyles} from 'react-select';
import {
	genreOptions,
	goalsOptions,
	matchAgeOptions,
	matchGenderOptions,
	matchExperienceOptions,
	methodsOptions, matchLocationsOptions, genderOptions, interestsOptions, personalityTraitsOptions
} from '../reusables/inputOptions.jsx';
import {customStyles} from '../reusables/customInputStyles.jsx';
import {extraFormStyles} from '../dashboard/extraFormStyles.jsx';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {recommendationsFormValidationSchema} from './recommendationsFormValidationSchema.jsx';
import {ErrorElement} from '../reusables/errorElement.jsx';
import {useAuth} from '../utils/AuthContext.jsx';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {handleCloseMenu} from '../register/register.jsx';
import {closeSettings} from '../reusables/profile-card-functions.jsx';


export function RecommendationsForm({preferencesData, setPreferencesData}) {
	const combinedStyles = mergeStyles(customStyles, extraFormStyles);
	const { tokenValue } = useAuth();
	const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

	// Initialize react-hook-form with Yup schema
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		clearErrors,
		setError,
		trigger,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: preferencesData,
		resolver: yupResolver(recommendationsFormValidationSchema),
		mode: "onChange",
	});



	// get user preferences data
	// useEffect(() => {
	//
	// 	const getPreferencesData = async() => {
	// 		const controller = new AbortController(); // Create an abort controller
	// 		const signal = controller.signal;
	//
	// 		try {
	// 			const response = await axios.get(`${VITE_BACKEND_URL}/api/me/bio`, {
	// 					headers: { Authorization: `Bearer ${tokenValue}` },
	// 					signal
	// 			})
	//
	// 			// formatting data (mostly to objects) for dashboard form
	// 			const gender = genderOptions.find(gender => gender.value === response.data.gender);
	// 			const additionalInterests = backToObject(response.data.additionalInterests, interestsOptions);
	// 			const personalityTraits = backToObject(response.data.personalityTraits, personalityTraitsOptions);
	// 			const goalsWithMusic = backToObject(response.data.goalsWithMusic, goalsOptions);
	// 			const preferredMethod = backToObject(response.data.preferredMethod, methodsOptions);
	// 			const preferredMusicGenres = backToObject(response.data.preferredMusicGenres, genreOptions);
	// 			const location = response.data.location ? {value: response.data.location, label: response.data.location} : "";
	//
	// 			console.log("Response: ", response);
	//
	// 			// data for the form
	// 			setPreferencesData({
	// 				...response.data,
	// 			});
	//
	// 			console.log("Data fetched!");
	// 		} catch (error) {
	// 			if (axios.isCancel(error)) {
	// 				console.log("Fetch aborted");
	// 			} else {
	// 				if (error.response) {
	// 					console.error("Backend error:", error.response.data); // Server responded with an error
	// 				} else {
	// 					console.error("Request failed:", error.message); // Network error or request issue
	// 				}
	// 			}
	// 		} finally {
	// 			// setLoading(false);
	// 		}
	// 	}
	// 	getPreferencesData();
	//
	// 	return () => controller.abort(); // Cleanup function to abort request
	// }, [])


	return (
		<>
		<form className={"recommendations-form"}
			  onSubmit={handleSubmit( (data) => {
				  setPreferencesData(data);
			  })}
			  autoComplete={'off'}
			  noValidate
			  id={'recommendations-form'}>
			<div className='form-title'>
				<h1>Who are you looking for?</h1>
			</div>

			<div className={'line large'}>
				<label id='idealMatchGenres'>
					Which genres should they prefer?*
					<br/>
					<Select
						className='basic-multi-select long'
						classNamePrefix='select'
						// // components={makeAnimated()}
						closeMenuOnSelect={false}
						isClearable={true}
						isSearchable={true}
						isMulti={true}
						containerExpand={true}
						wideMenu={true}
						name={'idealMatchGenres'}
						placeholder='Choose 1-3 genres'
						options={genreOptions}
						isOptionDisabled={() => (watch('idealMatchGenres') || []).length >= 3}
						styles={combinedStyles}
						value={watch('idealMatchGenres')}
						// value={watch('idealMatchGenres') || preferencesData.idealMatchGenres}
						isValid={!errors.idealMatchGenres && (watch('idealMatchGenres') || []).length > 0}
						isError={errors.idealMatchGenres} // Check if error exists
						onChange={(selectedOption) => {
							setValue('idealMatchGenres', selectedOption, {shouldValidate: true});
							// setPreferencesData((prev) => ({...prev, idealMatchGenres: selectedOption})); // Persist data correctly
							handleCloseMenu(selectedOption);

							if (!selectedOption || selectedOption.length === 0) {
								setError('idealMatchGenres', {message: 'Required'});
							} else {
								clearErrors('idealMatchGenres');
							}
						}}
						onBlur={() => trigger(name)} // Trigger validation when user leaves the field
					/>
					<ErrorElement errors={errors}  id={'idealMatchGenres'}/>
				</label>

			</div>

			<div className={'line large'}>
				<label id='idealMatchMethods'>
					How should they make music?*
					<br/>
					<Select
						className='basic-multi-select long'
						classNamePrefix='select'
						// components={makeAnimated()}
						closeMenuOnSelect={false}
						isClearable={true}
						isSearchable={true}
						isMulti={true}
						containerExpand={true}
						wideMenu={true}
						name={'idealMatchMethods'}
						placeholder='Choose 1-3 methods'
						options={methodsOptions}
						isOptionDisabled={() => (watch('idealMatchMethods') || []).length >= 3}
						styles={combinedStyles}
						value={watch('idealMatchMethods')}
						// value={watch('idealMatchMethods') || preferencesData.idealMatchMethods}
						isValid={!errors.idealMatchMethods && (watch('idealMatchMethods') || []).length > 0}
						isError={errors.idealMatchMethods} // Check if error exists
						onChange={(selectedOption) => {
							setValue('idealMatchMethods', selectedOption, {shouldValidate: true});
							// setPreferencesData((prev) => ({...prev, matchPreferredMethods: selectedOption})); // Persist data correctly
							handleCloseMenu(selectedOption);

							if (!selectedOption || selectedOption.length === 0) {
								setError('idealMatchMethods', {message: 'Required'});
							} else {
								clearErrors('idealMatchMethods');
							}
						}}
						onBlur={() => trigger('idealMatchMethods')} // Trigger validation when user leaves the field
					/>
					<ErrorElement errors={errors}  id={'idealMatchMethods'}/>
				</label>
			</div>
			<div className={'line large'}>
				<label id='idealMatchGoals'>
					What should their goals be?*
					<br/>
					<Select
						className='basic-multi-select long'
						classNamePrefix='select'
						// components={makeAnimated()}
						closeMenuOnSelect={false}
						isClearable={true}
						isSearchable={true}
						isMulti={true}
						containerExpand={true}
						wideMenu={true}
						name={'idealMatchGoals'}
						placeholder='Choose 1-3 goals'
						options={goalsOptions}
						isOptionDisabled={() => (watch('idealMatchGoals') || []).length >= 3}
						styles={combinedStyles}
						value={watch('idealMatchGoals')}
						// value={watch('idealMatchGoals') || preferencesData.idealMatchGoals}
						isValid={!errors.idealMatchGoals && (watch('idealMatchGoals') || []).length > 0}
						isError={errors.idealMatchGoals} // Check if error exists
						onChange={(selectedOption) => {
							setValue('idealMatchGoals', selectedOption, {shouldValidate: true});
							// setPreferencesData((prev) => ({...prev, idealMatchGoals: selectedOption})); // Persist data correctly
							handleCloseMenu(selectedOption);

							if (!selectedOption || selectedOption.length === 0) {
								setError('idealMatchGoals', {message: 'Required'});
							} else {
								clearErrors('idealMatchGoals');
							}
						}}
						onBlur={() => trigger('idealMatchGoals')} // Trigger validation when user leaves the field
					/>
					<ErrorElement errors={errors}  id={'idealMatchGoals'}/>
				</label>
			</div>
			<div className={'line'}>
				<label id='idealMatchGender' className={'short'}>
					Gender*
					<br/>
					<Select
						className='basic-single short'
						classNamePrefix='select'
						menuWidth='short'
						isClearable={true}
						isSearchable={true}
						// components={makeAnimated()}
						name={'idealMatchGender'}
						placeholder='Select gender'
						options={matchGenderOptions}
						styles={combinedStyles}
						value={watch('idealMatchGender')}
						// value={watch('idealMatchGender') || preferencesData.idealMatchGender}
						isValid={!errors.idealMatchGender && watch('idealMatchGender')}
						isError={errors.idealMatchGender} // Check if error exists
						onChange={(selectedOption) => {
							setValue('idealMatchGender', selectedOption, {shouldValidate: true});
							// setPreferencesData((prev) => ({...prev, idealMatchGender: selectedOption})); // Persist data correctly

							if (!selectedOption || Object.keys(selectedOption).length === 0) {
								setError('idealMatchGender', {message: 'Required'});
							} else {
								clearErrors('idealMatchGender');
							}
						}}
						onBlur={() => trigger('idealMatchGender')} // Trigger validation when user leaves the field
					/>
					<ErrorElement errors={errors}  id={'idealMatchGender'}/>
				</label>
				<label id='idealMatchAge' className={'short'}>
					Age*
					<br/>
					<Select
						className='basic-single short'
						classNamePrefix='select'
						menuWidth='short'
						isClearable={true}
						isSearchable={true}
						menuTop={true}
						menuPlacement={'top'}
						// components={makeAnimated()}
						name={'idealMatchAge'}
						placeholder='Select age gap'
						options={matchAgeOptions}
						styles={combinedStyles}
						value={watch('idealMatchAge')}
						// value={watch('idealMatchAge') || preferencesData.idealMatchAge}
						isValid={!errors.idealMatchAge && watch('idealMatchAge')}
						isError={errors.idealMatchAge} // Check if error exists
						onChange={(selectedOption) => {
							setValue('idealMatchAge', selectedOption, {shouldValidate: true});
							// setPreferencesData((prev) => ({...prev, idealMatchAge: selectedOption})); // Persist data correctly

							if (!selectedOption || Object.keys(selectedOption).length === 0) {
								setError('idealMatchAge', {message: 'Required'});
							} else {
								clearErrors('idealMatchAge');
							}
						}}
						onBlur={() => trigger('idealMatchAge')} // Trigger validation when user leaves the field
					/>
					<ErrorElement errors={errors}  id={'idealMatchAge'}/>
				</label>
			</div>

			<div className={'line'}>
				<label id='idealMatchYearsOfExperience' className={'short'}>
					Years of music experience*
					<br/>
					<Select
						className='basic-single short'
						classNamePrefix='select'
						menuWidth='short'
						isClearable={true}
						isSearchable={true}
						menuTop={true}
						menuPlacement={'top'}
						// components={makeAnimated()}
						name={'idealMatchYearsOfExperience'}
						placeholder='Select experience'
						options={matchExperienceOptions}
						styles={combinedStyles}
						value={watch('idealMatchYearsOfExperience')}
						// value={watch('idealMatchYearsOfExperience') || preferencesData.idealMatchYearsOfExperience}
						isValid={!errors.idealMatchYearsOfExperience && watch('idealMatchYearsOfExperience')}
						isError={errors.idealMatchYearsOfExperience} // Check if error exists
						onChange={(selectedOption) => {
							setValue('idealMatchYearsOfExperience', selectedOption, {shouldValidate: true});
							// setPreferencesData((prev) => ({...prev, idealMatchYearsOfExperience: selectedOption})); // Persist data correctly

							if (!selectedOption || Object.keys(selectedOption).length === 0) {
								setError('idealMatchYearsOfExperience', {message: 'Required'});
							} else {
								clearErrors('idealMatchYearsOfExperience');
							}
						}}
						onBlur={() => trigger('idealMatchYearsOfExperience')} // Trigger validation when user leaves the field
					/>
					<ErrorElement errors={errors}  id={'idealMatchYearsOfExperience'}/>
				</label>
				<label id='idealMatchLocation' className={'short'}>
					Location*
					<br/>
					<Select
						className='basic-single short'
						classNamePrefix='select'
						menuWidth='short'
						isClearable={true}
						isSearchable={true}
						menuTop={true}
						menuPlacement={'top'}
						// components={makeAnimated()}
						name={'idealMatchLocation'}
						placeholder='Select proximity'
						options={matchLocationsOptions}
						styles={combinedStyles}
						value={watch('idealMatchLocation')}
						// value={watch('idealMatchLocation') || preferencesData.idealMatchLocation}
						isValid={!errors.idealMatchLocation && watch('idealMatchLocation')}
						isError={errors.idealMatchLocation} // Check if error exists
						onChange={(selectedOption) => {
							setValue('idealMatchLocation', selectedOption);
							clearErrors("idealMatchLocation");
							console.log("New selection:", selectedOption); // Debugging
							// setPreferencesData((prev) => ({...prev, idealMatchLocation: selectedOption})); // Persist data correctly

							// if (!selectedOption || Object.keys(selectedOption).length === 0) {
							// 	setError('idealMatchLocation', {message: 'Required'});
							// } else {
							// 	clearErrors('idealMatchLocation');
							// }
						}}
						onBlur={() => trigger('idealMatchLocation')} // Trigger validation when user leaves the field
					/>
					<ErrorElement errors={errors}  id={'idealMatchLocation'}/>
				</label>

			</div>

		</form>
		<div className='settings-buttons-container'>

			<button className={`save ${Object.keys(errors).length > 0 ? 'disabled' : ''}`} onClick={closeSettings} type={'submit'} form={'recommendations-form'} disabled={Object.keys(errors).length > 0} >
				Save
			</button>

			<button className='cancel' type={'button'} onClick={() => {
				reset();
				closeSettings();
			}}>
				cancel
			</button>

		</div>
		</>
	)
}