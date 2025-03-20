import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import Select, {mergeStyles} from 'react-select';
import {customStyles} from '../reusables/customInputStyles.jsx';
import {dashboardFormStyles} from './dashboardFormStyles.jsx';
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

export function DashboardForm({myData, setMyData, formOpen}) {
	const [inputValue, setInputValue] = useState("");
	const { apiLoaded, autocompleteServiceRef, fetchPlaces, options } = useGooglePlacesApi();
	const combinedStyles = mergeStyles(customStyles, dashboardFormStyles);
	const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;

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

	// useEffect(() => {
	// 	// Make sure the initial values are set
	// 	console.log("setting musiclink value");
	// 	if (myData) {
	// 		setValue('musicLink', myData.linkToMusic || '');
	// 	}
	// }, [formOpen]);

	useEffect(() => {
		console.log("Errors:", errors);
	}, [errors]);

	useEffect(() => {
		console.log("myData: ", myData);
	}, [myData]);

	return (
		<>
		<form className="dashboard-form"
			  onSubmit={handleSubmit((data) => {
				  setMyData(data);
				  // onSubmit(data, formOneData, setFormOneData);
				  console.log("Errors on submit: ", errors);
			  })}
			  autoComplete={'off'}
			  noValidate
				id={'dashboard-form'}>

			{/* step 1 */}
			<div className="form-title">
				<h1>Basic info</h1>
			</div>

			{/* First Name */}
			<div className="line">
				<label className="long">
					First name*
					<input
						type="text"
						placeholder="Enter your first name"
						className={`not-react-select long focus-highlight 
							${errors.firstName ? "error" : ""}
							${!errors.firstName && watch('firstName') ? "valid" : ""}`}
						{...register("firstName")}
						autoComplete={"off"}
						// value={myData.firstName}
						value={watch('firstName') || myData.firstName}
						// autoFocus={'on'}
						onBlur={() => trigger('firstName')} // Trigger validation when user leaves the field
						// onChange={(value) => {
						// 	setMyData((prev) => ({ ...prev, firstName: value }));
						// }}
					/>
					<ErrorElement errors={errors}  id={'firstName'}/>

				</label>

				{/* Last Name */}
				<label className="long">
					Last name*
					<input
						type="text"
						placeholder="Enter your last name"
						className={`not-react-select long focus-highlight 
							${errors.lastName ? "error" : ""}
							${!errors.lastName && watch('lastName') ? "valid" : ""}`}
						{...register("lastName")}
						autoComplete={"off"}
						value={watch('lastName') || myData.lastName}
						onBlur={() => trigger('lastName')} // Trigger validation when user leaves the field
						// onChange={(value) => {
						// 	setMyData((prev) => ({ ...prev, lastName: value }));
						// }}
					/>
					<ErrorElement errors={errors}  id={'lastName'}/>
				</label>
			</div>

			{/* Gender and Age */}
			<div className="line">
				<label className="long">
					Gender*
					<Select
						className={`basic-single long`}
						classNamePrefix="select"
						// menuWidth="short"
						wideMenu={false}
						name={"gender"}
						isValid={!errors.gender && watch('gender') !== ''}
						isError={errors.gender} // Set error if cleared
						isClearable
						isSearchable
						styles={combinedStyles}
						menuTop={false}
						// components={makeAnimated()}
						options={genderOptions}
						placeholder="Select gender"
						// value={watch('gender')}
						// value={genderOptions.find(option => option.value === watch('gender')?.value) || null}
						// value={myData.gender}
						value={watch('gender') || myData.gender}
						autoComplete={"off"}
						onChange={(selectedOption) => {
							// setValue("gender", selectedOption?.value || "", { shouldValidate: true, shouldDirty: true });
							// trigger("gender"); // Ensures validation runs on change
							// setValue("gender", selectedOption?.value || "", { shouldValidate: true, shouldDirty: true });
							// console.log("Watch gender:", watch('gender'));
							// console.log("Select value:", genderOptions.find(option => option.value === watch('gender')));
							console.log("New selection:", selectedOption); // Debugging
							console.log("myData.gender:", myData.gender);
							// if (!selectedOption) {
							// 	setValue("gender", "");  // Clear value when selection is cleared
							// } else {
							// 	setValue("gender", selectedOption || null, { shouldValidate: true, shouldDirty: true });
							// 	clearErrors("gender");
							// }
							setValue("gender", selectedOption);  // ✅ Set entire object, not just string
							// setMyData((prev) => ({ ...prev, gender: selectedOption }));
							clearErrors("gender");
						}}
						// onChange={(selectedOption) => {
						// 	console.log("New selection:", selectedOption);
						// 	setValue("gender", selectedOption?.value || "", { shouldValidate: true, shouldDirty: true });
						// 	trigger("gender"); // Ensures validation updates immediately
						//
						// }}
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
							autoComplete={'off'}
							min={0}
							max={120}
							onBlur={() => trigger('age')} // Trigger validation when user leaves the field
							onChange={(value) => {
								// setMyData((prev) => ({ ...prev, age: value }));
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
				id={'preferredGenresDashboard'}
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
				id={'preferredMethodsDashboard'}
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
				id={'additionalInterestsDashboard'}
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
				id={'personalityTraitsDashboard'}
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
				id={'goalsDashboard'}
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
					{/*<div className={'with-button'}>*/}
					{/*	<input*/}
					{/*		type='number'*/}
					{/*		id='experience'*/}
					{/*		name={'experience'}*/}
					{/*		className={`not-react-select focus-highlight short */}
					{/*		${errors.experience ? 'error' : ''}*/}
					{/*		${!errors.experience && watch('experience') ? 'valid' : ''}`}*/}
					{/*		placeholder='Enter number of years'*/}
					{/*		// autoFocus={true}*/}
					{/*		{...register('experience')}*/}
					{/*		autoComplete={'off'}*/}
					{/*		min={0}*/}
					{/*		// max={formOneData.age}*/}
					{/*		max={120}*/}
					{/*		// value={formThreeData.experience || ''}*/}
					{/*		value={watch('experience') || myData.yearsOfMusicExperience}*/}
					{/*		onChange={(value) => {*/}
					{/*			// const value = e.target.value ? parseInt(e.target.value, 10) : 0;*/}
					{/*			// setValue('experience', value, {shouldValidate: true});*/}
					{/*			// setMyData((prev) => ({...prev, experience: value}));*/}
					{/*			setValue("experience", value);  // ✅ Set entire object, not just string*/}
					{/*			// setMyData((prev) => ({ ...prev, yearsOfMusicExperience: value }));*/}
					{/*			clearErrors("experience");*/}
					{/*		}}*/}
					{/*		onBlur={() => trigger('experience')} // Trigger validation when user leaves the field*/}
					{/*	/>*/}
					{/*	<IncrementDecrementButtons id={'experience'} watch={watch} setValue={setValue} trigger={trigger} />*/}
					{/*	/!*setMyData={setFormThreeData}*!/*/}
					{/*</div>*/}
					<div className={'with-button'}>
						<input
							id={'yearsOfMusicExperience'}
							type='number'
							placeholder='Enter number in years'
							className={`not-react-select long focus-highlight 
							${errors.yearsOfMusicExperience ? 'error' : ''}
							${!errors.yearsOfMusicExperience && watch('yearsOfMusicExperience') ? 'valid' : ''}`}
							{...register('yearsOfMusicExperience')}
							autoComplete={'off'}
							min={0}
							max={myData.age}
							onBlur={() => trigger('yearsOfMusicExperience')} // Trigger validation when user leaves the field
							onChange={(value) => {
								// setMyData((prev) => ({ ...prev, age: value }));
							}}
						/>
						<IncrementDecrementButtons id={'yearsOfMusicExperience'} watch={watch} setValue={setValue} trigger={trigger} />
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
						// value={watch('musicLink') || ""}
						value={watch('linkToMusic') || myData.linkToMusic}
						{...register('linkToMusic')}
						autoComplete={'off'}
						// onChange={(selectedOption) => {
						// 	setValue("musicLink", selectedOption);  // ✅ Set entire object, not just string
						// 	// setMyData((prev) => ({ ...prev, linkToMusic: selectedOption }));
						// 	clearErrors("musicLink");
						// }}
						onBlur={() => trigger('linkToMusic')} // Trigger validation when user leaves the field
						onChange={(e) => {
							const value = e.target.value;
							setValue('linkToMusic', value, { shouldValidate: true });
							// setMyData((prev) => ({ ...prev, description: value }));
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
							setInputValue(val);
							fetchPlaces(val);
						}}
						placeholder='Search for your city'
						isClearable={true}
						styles={combinedStyles}
						wideMenu={true}
						closeMenuOnSelect={true}
						value={watch('location') || myData.location}
						autoComplete={'off'}
						isValid={
							!errors.location &&
							watch('location') &&
							watch('location').label &&
							watch('location').value
						}
						isError={!!errors.location} // Check if error exists
						// onChange={(selectedOption) => {
						// 	setValue('location', selectedOption, {shouldValidate: true});
						// 	setFormThreeData((prev) => ({...prev, location: selectedOption})); // Persist data correctly
						// }}
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
						value={watch('description') || myData.description}
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
