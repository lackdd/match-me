
// step 3 of registration
import Select from 'react-select';
import {customStyles} from './customInputStyles.jsx';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {stepThreeSchema} from './validationSchema.jsx';
import {ErrorElement} from './error-element.jsx';


function Step3({formThreeData, setFormThreeData, stepFunctions, formOneData, onSubmit}) {
	const [inputValue, setInputValue] = useState("");
	const [options, setOptions] = useState([]);
	const autocompleteServiceRef = useRef(null);

	const isMounted = useRef(true);
	// Initialize react-hook-form with Yup schema
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		trigger,
		formState: { errors },
	} = useForm({
		defaultValues: formThreeData,
		resolver: yupResolver(stepThreeSchema(formOneData)),
		mode: "onChange",
	});

	useEffect(() => {
		// Set isMounted to true when the component mounts
		isMounted.current = true;

		return () => {
			// Set isMounted to false when the component unmounts
			isMounted.current = false;
		};
	}, []);


// Initialize the autocomplete service only when the API is loaded
	useEffect(() => {
		if (window.google && window.google.maps && window.google.maps.places) {
			autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
		}
	}, []);

	const fetchPlaces = useCallback((input) => {
		if (!input || !autocompleteServiceRef.current) return;

		autocompleteServiceRef.current.getPlacePredictions(
			{ input, types: ["(cities)"] },
			// { input },
			(predictions, status) => {
				if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
					setOptions(
						predictions.map((place) => ({
							value: place.place_id,
							label: place.description,
						}))
					);
				} else {
					setOptions([]);
				}
			}
		);
	}, []);

	return (
		<form className='step-three'
			  onSubmit={handleSubmit((data) => onSubmit(data, formThreeData, setFormThreeData))}
			  autoComplete={'off'}
			  noValidate>
			<div className='form-title'>
				<h1>A little bit more...</h1>
			</div>

			<div className={'line'}>
				<label id='experience' className={'short'}>
					Years of music experience*
					<br/>
					<input
						type='number'
						id='experience'
						name={'experience'}
						className={`not-react-select focus-highlight short 
						${errors.experience ? "error" : ""}
						${!errors.experience && watch('experience') ? "valid" : ""}`}
						placeholder='Enter number of years'
						autoFocus={true}
						{...register("experience")}
						autoComplete={"off"}
						min={0}
						max={formOneData.age}
						value={formThreeData.experience || ""}
						onChange={(e) => {
							const value = e.target.value ? parseInt(e.target.value, 10) : 0;
							setValue('experience', value, { shouldValidate: true });
							setFormThreeData((prev) => ({ ...prev, experience: value }));
						}}
						onBlur={() => trigger('experience')} // Trigger validation when user leaves the field
					/>
					<ErrorElement errors={errors}  id={'experience'}/>
				</label>
				<label id='music' className={'short'}>
					Link to your music
					<br/>
					<input
						type='url'
						id='music'
						name={'musicLink'}
						className={`not-react-select focus-highlight short
						${errors.musicLink ? 'error' : ''}
						${!errors.musicLink && watch('musicLink') ? 'valid' : ''}`}
						placeholder='Link to your Spotify etc'
						value={watch('musicLink') || null}
						{...register('musicLink')}
						autoComplete={'off'}
						onChange={(e) => {
							const selectedValue = e.target.value;
							setValue('musicLink', selectedValue, { shouldValidate: true });
							setFormThreeData((prev) => ({ ...prev, musicLink: selectedValue }));
						}}
						onBlur={() => trigger('musicLink')} // Trigger validation when user leaves the field
					/>
					<ErrorElement errors={errors}  id={'musicLink'}/>
				</label>

			</div>
			<div className={'line large'}>

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
						styles={customStyles}
						wideMenu={true}
						closeMenuOnSelect={true}
						value={watch('location') || null}
						autoComplete={'off'}
						isValid={
							!errors.location &&
							watch('location') &&
							watch('location').label &&
							watch('location').value
						}
						isError={!!errors.location} // Check if error exists
						onChange={(selectedOption) => {
							setValue('location', selectedOption, {shouldValidate: true});
							setFormThreeData((prev) => ({...prev, location: selectedOption})); // Persist data correctly
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
						className={`description-container focus-highlight
						${errors.description ? 'error' : ''}
						${!errors.description && watch('description') ? 'valid' : ''}`}
						placeholder='Say a few words about yourself...'
						{...register('description')}
						autoComplete={'off'}
						value={formThreeData.description || ""}
						onChange={(e) => {
							const value = e.target.value;
							setValue('description', value, { shouldValidate: true });
							setFormThreeData((prev) => ({ ...prev, description: value }));
						}}
					/>
					<ErrorElement errors={errors}  id={'description'}/>
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
					className={`next wide narrow ${Object.keys(errors).length > 0 ? "disabled" : ""}`}
					type={'submit'}
				>
					Next
				</button>
			</div>
		</form>
	);
}

export default Step3;