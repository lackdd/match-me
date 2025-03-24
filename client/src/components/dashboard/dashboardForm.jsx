import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import Select, {mergeStyles} from 'react-select';
import {customStyles} from '../reusables/customInputStyles.jsx';
import {extraFormStyles} from './extraFormStyles.jsx';
import {
	genderOptions,
	genreOptions, goalsOptions,
	interestsOptions,
	methodsOptions,
	personalityTraitsOptions
} from '../reusables/inputOptions.jsx';
import {IncrementDecrementButtons} from '../reusables/incrementDecrementButtons.jsx';
import './forms.scss'
import '../reusables/incrementDecrementButtons.scss'
import '../reusables/errorElement.scss'
import {ErrorElement} from '../reusables/errorElement.jsx';
import React, {useEffect, useState} from 'react';
import {dashboardFormValidationSchema} from './dashboardFormValidationSchema.jsx';
import {CustomSelect} from '../register/register-step-2.jsx';
import {useGooglePlacesApi} from '../reusables/useGooglePlacesApi.jsx';
import {closeSettings} from '../reusables/profile-card-functions.jsx';
import axios from 'axios';
import {useAuth} from '../utils/AuthContext.jsx';

export function DashboardForm({myData, setMyData, setMyDataFormatted, formatDataForView}) {
	const { apiLoaded, autocompleteServiceRef, fetchPlaces, options } = useGooglePlacesApi();
	const combinedStyles = mergeStyles(customStyles, extraFormStyles);
	const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
	const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
	const { tokenValue } = useAuth();

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
		defaultValues: myData,
		resolver: yupResolver(dashboardFormValidationSchema),
		mode: 'onChange',
	});

	useEffect(() => {
		console.log("Errors:", errors);
	}, [errors]);

	useEffect(() => {
		console.log("myData: ", myData);
	}, [myData]);

	// on submit send data to backend
	const Submit = async (formattedData) => {
		console.log("Sending:", JSON.stringify(formattedData, null, 2));
		try {
			const response = await
				axios.patch(`${VITE_BACKEND_URL}/api/me/profile`, formattedData, {
					headers: {
						Authorization: `Bearer ${tokenValue}`,
						'Content-Type': 'application/json'}

				});
			console.log("User data edited successfully");
			console.log("Data: ", response.data);
		} catch (error) {
			if (error.response) {
				console.error("Backend error:", error.response.data); // Server responded with an error
			} else {
				console.error("Request failed:", error.message); // Network error or request issue
			}
		}
	};

	return (
		<>
		<form className="dashboard-form"
			  onSubmit={handleSubmit((data) => {
				  setMyData(data);

				  console.log("Data at submit: ", data);

				  const formattedData = {
                      age: data.age,
                      gender: data.gender.value,
                      location: data.location.label,
                      description: data.description,
					  yearsOfMusicExperience: data.yearsOfMusicExperience,
                      linkToMusic: data.linkToMusic,
                      additionalInterests: data.additionalInterests.map(item => item.value),
                      preferredMethod: data.preferredMethod.map(item => item.value),
                      preferredMusicGenres: data.preferredMusicGenres.map(item => item.value),
                      goalsWithMusic: data.goalsWithMusic.map(item => item.value),
                      personalityTraits: data.personalityTraits.map(item => item.value),
				  }

				  Submit(formattedData);

				  setMyDataFormatted((prev) => ({
					  ...prev,
					  ...formatDataForView(formattedData)
				  }));
				  console.log("Errors on submit: ", errors);
			  })}
			  autoComplete={'off'}
			  noValidate
			  id={'dashboard-form'}>

			{/* step 1 */}
			<div className="form-title">
				<h1>Basic info</h1>
			</div>

			{/*/!* First Name *!/*/}
			{/*<div className="line">*/}
			{/*	<label className="long">*/}
			{/*		First name**/}
			{/*		<input*/}
			{/*			type="text"*/}
			{/*			placeholder="Enter your first name"*/}
			{/*			className={`not-react-select long focus-highlight */}
			{/*				${errors.firstName ? "error" : ""}*/}
			{/*				${!errors.firstName && watch('firstName') ? "valid" : ""}`}*/}
			{/*			{...register("firstName")}*/}
			{/*			autoComplete={"off"}*/}
			{/*			// value={myData.firstName}*/}
			{/*			value={watch('firstName') || myData.firstName}*/}
			{/*			// autoFocus={'on'}*/}
			{/*			onBlur={() => trigger('firstName')} // Trigger validation when user leaves the field*/}
			{/*			// onChange={(value) => {*/}
			{/*			// 	setMyData((prev) => ({ ...prev, firstName: value }));*/}
			{/*			// }}*/}
			{/*		/>*/}
			{/*		<ErrorElement errors={errors}  id={'firstName'}/>*/}

			{/*	</label>*/}

			{/*	/!* Last Name *!/*/}
			{/*	<label className="long">*/}
			{/*		Last name**/}
			{/*		<input*/}
			{/*			type="text"*/}
			{/*			placeholder="Enter your last name"*/}
			{/*			className={`not-react-select long focus-highlight */}
			{/*				${errors.lastName ? "error" : ""}*/}
			{/*				${!errors.lastName && watch('lastName') ? "valid" : ""}`}*/}
			{/*			{...register("lastName")}*/}
			{/*			autoComplete={"off"}*/}
			{/*			value={watch('lastName') || myData.lastName}*/}
			{/*			onBlur={() => trigger('lastName')} // Trigger validation when user leaves the field*/}
			{/*			// onChange={(value) => {*/}
			{/*			// 	setMyData((prev) => ({ ...prev, lastName: value }));*/}
			{/*			// }}*/}
			{/*		/>*/}
			{/*		<ErrorElement errors={errors}  id={'lastName'}/>*/}
			{/*	</label>*/}
			{/*</div>*/}

			{/* Gender and Age */}
			<div className="line">
				<label className="long">
					Gender*
					<Select
						className={`basic-single long`}
						classNamePrefix="select"
						wideMenu={false}
						name={"gender"}
						isValid={!errors.gender && watch('gender') !== ''}
						isError={errors.gender} // Set error if cleared
						isClearable
						isSearchable
						styles={combinedStyles}
						menuTop={false}
						options={genderOptions}
						placeholder="Select gender"
						// value={watch('gender') || myData.gender}
						value={watch('gender')}
						autoComplete={"off"}
						onChange={(selectedOption) => {
							setValue("gender", selectedOption, { shouldValidate: true });  // ✅ Set entire object, not just string
							// setMyData((prev) => ({ ...prev, gender: selectedOption }));
							clearErrors("gender");
						}}

						onBlur={() => trigger('gender')} // Trigger validation when user leaves the field
					/>

					<ErrorElement errors={errors}  id={'gender'}/>
				</label>

				<label className="long">
					Age*
					<div className={'with-button'}>
						<input
							id={'age'}
							type='number'
							placeholder='Enter your age'
							className={`not-react-select long focus-highlight 
							${errors.age ? 'error' : ''}
							${!errors.age && watch('age') ? 'valid' : ''}`}
							{...register('age')}
							// value={watch('age') || myData.age}
							value={watch('age')}
							autoComplete={'off'}
							min={0}
							max={120}
							onBlur={() => trigger('age')} // Trigger validation when user leaves the field
							onChange={(e) => {
								const value = e.target.value ? parseInt(e.target.value, 10) : 0;
								setValue('age', value, { shouldValidate: true });
								// setMyData((prev) => ({ ...prev, age: value}));
							}}
						/>
						<IncrementDecrementButtons id={'age'} watch={watch} setValue={setValue} trigger={trigger} />
					</div>

					<ErrorElement errors={errors} id={'age'}/>
				</label>
			</div>


			{/* step 2 */}
			<div className='form-title'>
				<h1>Other info</h1>
			</div>

			<CustomSelect
				autoFocus={'on'}
				initallyValid={true}
				data={myData.preferredMusicGenres}
				placeholder={'Preferred music genres'}
				options={genreOptions}
				id={'preferredGenres'}
				name={'genres'}
				register={register}
				watch={watch}
				setValue={setValue}
				trigger={trigger}
				errors={errors}
				setError={setError}
				clearErrors={clearErrors}
				// setFormTwoData={setMyData}
			/>

			<CustomSelect
				autoFocus={'on'}
				data={myData.preferredMethod}
				placeholder={'Preferred methods'}
				options={methodsOptions}
				id={'preferredMethod'}
				name={'methods'}
				register={register}
				watch={watch}
				setValue={setValue}
				trigger={trigger}
				errors={errors}
				setError={setError}
				clearErrors={clearErrors}
				// setFormTwoData={setMyData}
			/>

			<CustomSelect

				data={myData.additionalInterests}
				placeholder={'Additional interests'}
				options={interestsOptions}
				id={'additionalInterests'}
				name={'interests'}
				register={register}
				watch={watch}
				setValue={setValue}
				trigger={trigger}
				errors={errors}
				setError={setError}
				clearErrors={clearErrors}
				// setFormTwoData={setMyData}
			/>

			<CustomSelect
				data={myData.personalityTraits}
				placeholder={'Personality traits'}
				options={personalityTraitsOptions}
				id={'personalityTraits'}
				name={'personality traits'}
				register={register}
				watch={watch}
				setValue={setValue}
				trigger={trigger}
				errors={errors}
				setError={setError}
				clearErrors={clearErrors}
				// setFormTwoData={setMyData}
			/>

			<CustomSelect
				data={myData.goalsWithMusic}
				placeholder={'Goals'}
				options={goalsOptions}
				id={'goalsWithMusic'}
				name={'goals'}
				register={register}
				watch={watch}
				setValue={setValue}
				trigger={trigger}
				errors={errors}
				setError={setError}
				clearErrors={clearErrors}
				// setFormTwoData={setMyData}
			/>


			{/* step 3 */}
			<div className='form-title'>
				{/*<h1>A little bit more...</h1>*/}
			</div>

			{/* todo valid disappears when cancelled*/}
			<div className={'line'}>
				<label id='experience' className={'short'}>
					Years of music experience*
					<br/>
					<div className={'with-button'}>
						<input
							id={'yearsOfMusicExperience'}
							type='number'
							placeholder='Enter number in years'
							className={`not-react-select long focus-highlight 
							${errors.yearsOfMusicExperience ? 'error' : ''}
							${!errors.yearsOfMusicExperience && (watch('yearsOfMusicExperience') || watch('yearsOfMusicExperience') === 0) ? 'valid' : ''}`}
							{...register('yearsOfMusicExperience')}
							// value={watch('yearsOfMusicExperience') || myData.yearsOfMusicExperience}
							value={watch('yearsOfMusicExperience')}
							autoComplete={'off'}
							min={0}
							max={myData.age}
							onBlur={() => trigger('yearsOfMusicExperience')} // Trigger validation when user leaves the field
							onChange={(e) => {
								const value = e.target.value ? parseInt(e.target.value, 10) : 0;

								if (value > myData.age) {
									setError('yearsOfMusicExperience', 'Years of music experience cannot exceed age');
									setValue('yearsOfMusicExperience', myData.age, { shouldValidate: true });
                                    return;
								}
								setValue('yearsOfMusicExperience', value, { shouldValidate: true });
								// setMyData((prev) => ({ ...prev, yearsOfMusicExperience: value}));
							}}
						/>
						<IncrementDecrementButtons id={'yearsOfMusicExperience'} watch={watch} setValue={setValue} trigger={trigger}/>
					</div>

					<ErrorElement errors={errors} id={'yearsOfMusicExperience'}/>
				</label>

				{/* todo can't change and valid disappears when cancelled*/}
				<label id='music' className={'short'}>
					Link to your music
					<br/>
					<input
						type='url'
						id='linkToMusic'
						name={'linkToMusic'}
						className={`not-react-select focus-highlight short
						${errors.linkToMusic ? 'error' : ''}
						${!errors.linkToMusic && watch('linkToMusic') ? 'valid' : ''}`}
						placeholder='Link to your Spotify etc'
						// value={watch('linkToMusic') || myData.linkToMusic}
						value={watch('linkToMusic')}
						{...register('linkToMusic')}
						autoComplete={'off'}
						onBlur={() => trigger('linkToMusic')} // Trigger validation when user leaves the field
						onChange={(e) => {
							const value = e.target.value;
							setValue('linkToMusic', value, { shouldValidate: true });
							// setMyData((prev) => ({ ...prev, linkToMusic: value }));
						}}
					/>
					<ErrorElement errors={errors}  id={'linkToMusic'}/>
				</label>

			</div>
			<div className={'line large'}>

				{/* todo  inital value not set and valid disappears when cancelled*/}
				<label id='location' className={'long'}>
					Location*
					<br/>
					<Select
						options={options}
						onInputChange={(val) => {
							// setInputValue(val);
							fetchPlaces(val);
						}}
						placeholder='Search for your city'
						isClearable={true}
						styles={combinedStyles}
						wideMenu={true}
						closeMenuOnSelect={true}
						value={watch('location')}
						autoComplete={'off'}
						isValid={
							!errors.location &&
							watch('location') &&
							watch('location').label &&
							watch('location').value
						}
						isError={!!errors.location} // Check if error exists
						onChange={(selectedOption) => {
							if (!selectedOption) {
								// Clear the location value in both the form state and component state
								setValue('location', null, { shouldValidate: true });
								clearErrors('location'); // Optionally clear the error state for location
							} else {
								// Handle setting the location from the Google API
								fetch(`https://maps.googleapis.com/maps/api/geocode/json?place_id=${selectedOption.value}&key=${googleApiKey}&language=en`)
									.then(response => response.json())
									.then(data => {
										if (data.status === "OK" && data.results.length > 0) {
											const addressComponents = data.results[0].address_components;

											let region = "";
											let country = "";

											// Extract administrative area and country explicitly
											addressComponents.forEach(component => {
												if (component.types.includes("administrative_area_level_1")) {
													region = component.long_name;
												}
												if (component.types.includes("country")) {
													country = component.long_name;
												}
											});

											const properName = `${region}${country ? `, ${country}` : ""}`;

											// Set the location value in the form state with value and label
											setValue('location', { value: selectedOption.value, label: properName }, { shouldValidate: true });
										}
									})
									.catch(error => console.error("Geocoding error:", error));
							}
						}}
						onBlur={() => trigger('location')} // Trigger validation when user leaves the field
					/>
					<ErrorElement errors={errors}  id={'location'}/>
				</label>
			</div>
			<div className={'line large'}>
				<label id='description'>
					Description
					<br/>
					<textarea
						maxLength={300}
						id='description'
						name={'description'}
						className={`form-description-container focus-highlight
						${errors.description ? 'error' : ''}
						${!errors.description && watch('description') ? 'valid' : ''}`}
						placeholder='Say a few words about yourself...'
						{...register('description')}
						autoComplete={'off'}
						// value={watch('description') || myData.description}
						value={watch('description')}
						onChange={(e) => {
							const value = e.target.value;
							setValue('description', value, { shouldValidate: true });
							// setMyData((prev) => ({ ...prev, description: value }));
						}}
					/>
					<ErrorElement errors={errors}  id={'description'}/>
				</label>
			</div>
		</form>

			<div className="settings-buttons-container">
				<button className={`save ${Object.keys(errors).length > 0 ? 'disabled' : ''}`} onClick={closeSettings} type={'submit'} form={'dashboard-form'} disabled={Object.keys(errors).length > 0} >
					Save
				</button>
				<button className="cancel" onClick={() => {
					reset();
					closeSettings();
				}} type={'button'} >
					Cancel
				</button>
			</div>
		</>
	);
}
