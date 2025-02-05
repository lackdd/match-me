
// step 2 of registration
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import {customStyles} from './customInputStyles.jsx';
import { LoadScript } from "@react-google-maps/api";
import {useCallback, useEffect, useRef, useState} from 'react';

function Step3({experience, setExperience,
			   location, setLocation,
				country, setCountry,
				city, setCity,
               musicLink, setMusicLink,
               description, setDescription,
               DeductStep, AddStep,
                age,setAge,
			   error, setError}) {


	const [inputValue, setInputValue] = useState("");
	const [options, setOptions] = useState([]);
	const autocompleteServiceRef = useRef(null);
	const [isLoaded, setIsLoaded] = useState(false); // Track if the script has loaded

	// Effect to check if the Google Maps API script has loaded
	// useEffect(() => {
	// 	const script = document.createElement("script");
	// 	script.src = `***REMOVED***api/js?key=${GOOGLE_API_KEY}&libraries=places`;
	// 	script.async = true;
	// 	script.defer = true;
	//
	// 	script.onload = () => {
	// 		setIsLoaded(true); // Update state when the script is loaded
	// 	};
	//
	// 	document.head.appendChild(script);
	//
	// 	return () => {
	// 		document.head.removeChild(script); // Clean up the script tag
	// 	};
	// }, []);

	const isMounted = useRef(true);

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
				console.log(predictions); // Log predictions to inspect the structure
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

	// const [inputValue, setInputValue] = useState("");
	// const [options, setOptions] = useState([]);
	// const autocompleteServiceRef = useRef(null);
	//
	// const fetchPlaces = useCallback((input) => {
	// 	if (!input || !autocompleteServiceRef.current) return;
	//
	// 	autocompleteServiceRef.current.getPlacePredictions(
	// 		{ input, types: ["(cities)"] },
	// 		(predictions, status) => {
	// 			if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
	// 				setOptions(
	// 					predictions.map((place) => ({
	// 						value: place.place_id,
	// 						label: place.description,
	// 					}))
	// 				);
	// 			} else {
	// 				setOptions([]);
	// 			}
	// 		}
	// 	);
	// }, []);


	return (
		<form className='step-three'
			  onSubmit={(e) => {
				  AddStep(e);
			  }}
			  autoComplete={"on"}
		>
			<div className='form-title'>
				<h1>A little bit more...</h1>
			</div>
			{/*<div className={'line large'}>*/}
			{/*	<label id='genres'>*/}
			{/*		Preferred music genres**/}
			{/*		<br/>*/}
			{/*		<input*/}
			{/*			type='text'*/}
			{/*			id='genres'*/}
			{/*			className={`focus-highlight ${error ? 'error-border' : ''}`}*/}
			{/*			placeholder='Choose 1-3 genres'*/}
			{/*			value={preferredGenres}*/}
			{/*			onChange={(e) => setPreferredGenres(e.target.value)}*/}
			{/*			// required*/}
			{/*		/>*/}
			{/*	</label>*/}
			{/*</div>*/}
			{/*<div className={'line large'}>*/}
			{/*	<label id='methods'>*/}
			{/*		Preferred methods**/}
			{/*		<br/>*/}
			{/*		<input*/}
			{/*			type='text'*/}
			{/*			id='methods'*/}
			{/*			className={`focus-highlight ${error ? 'error-border' : ''}`}*/}
			{/*			placeholder='Choose 1-3 methods'*/}
			{/*			value={preferredMethods}*/}
			{/*			onChange={(e) => setPreferredMethods(e.target.value)}*/}
			{/*			// required*/}
			{/*		/>*/}
			{/*	</label>*/}
			{/*</div>*/}
			{/*<div className={'line large'}>*/}
			{/*	<label id='interests'>*/}
			{/*		Additional interests**/}
			{/*		<br/>*/}
			{/*		<input*/}
			{/*			type='text'*/}
			{/*			id='interests'*/}
			{/*			className={`focus-highlight ${error ? 'error-border' : ''}`}*/}
			{/*			placeholder='Choose 1-3 interests'*/}
			{/*			value={additionalInterests}*/}
			{/*			onChange={(e) => setAdditionalInterests(e.target.value)}*/}
			{/*			// required*/}
			{/*		/>*/}
			{/*	</label>*/}
			{/*</div>*/}
			{/*<div className={'line large'}>*/}
			{/*	<label id='personality'>*/}
			{/*		Personality traits**/}
			{/*		<br/>*/}
			{/*		<input*/}
			{/*			type='text'*/}
			{/*			id='personality'*/}
			{/*			className={`focus-highlight ${error ? 'error-border' : ''}`}*/}
			{/*			placeholder='Choose 1-3 traits'*/}
			{/*			value={personalityTraits}*/}
			{/*			onChange={(e) => setPersonalityTraits(e.target.value)}*/}
			{/*			// required*/}
			{/*		/>*/}
			{/*	</label>*/}
			{/*</div>*/}
			<div className={'line'}>
				<label id='experience' className={'short'}>
					Years of music experience*
					<br/>
					<input
						type='number'
						id='experience'
						className={`not-react-select focus-highlight short ${error ? 'error-border' : ''}`}
						placeholder='Enter number of years'
						value={experience}
						onChange={(e) => setExperience(e.target.value)}
						min={0}
						max={age}
						// required
					/>
				</label>
				<label id='music' className={'short'}>
					Link to your music
					<br/>
					<input
						type='url'
						id='music'
						className={`not-react-select focus-highlight short ${error ? 'error-border' : ''}`}
						placeholder='Link to your Spotify etc'
						value={musicLink}
						onChange={(e) => setMusicLink(e.target.value)}
					/>
				</label>

			</div>
			<div className={'line large'}>
				{/* todo searchable location https://www.npmjs.com/package/react-select-places*/}

				<label id='location' className={'long'}>
					Location*
					<br/>
					{/*<input*/}
					{/*	type='text'*/}
					{/*	id='location'*/}
					{/*	className={`not-react-select focus-highlight short ${error ? 'error-border' : ''}`}*/}
					{/*	placeholder='Choose location'*/}
					{/*	value={location}*/}
					{/*	onChange={(e) => setLocation(e.target.value)}*/}
					{/*	// required*/}
					{/*/>*/}
					<Select
						options={options}
						onInputChange={(val) => {
							setInputValue(val);
							fetchPlaces(val);
						}}
						onChange={(selected) => {
							setLocation(selected);
						}}
						placeholder="Search for your city"
						isClearable={true}
						styles={customStyles}
						wideMenu={true}
						closeMenuOnSelect={true}
						value={location}
						// styles={{customStyles
						// 	// control: (provided) => ({
						// 	// 	...provided,
						// 	// 	width: "100%",
						// 	// 	minHeight: "2rem",
						// 	// 	borderRadius: "10px",
						// 	// 	borderColor: "rgb(97, 97, 97)",
						// 	// 	boxShadow: "none",
						// 	// 	"&:hover": {borderColor: "rgb(254, 110, 121)"},
						// 	// }),
						// }}
					/>
				</label>
			</div>
			<div className={'line large'}>
				<label id='description'>
					Description
					<br/>
					<textarea
						maxLength={300}
						id='description'
						className={`description-container focus-highlight ${error ? 'error-border' : ''}`}
						placeholder='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut consequatur cupiditate error eveniet hic qui reiciendis rerum tenetur? Deserunt eos laboriosam minima nihil praesentium repellendus reprehenderit saepe tenetur vel, velit? Fugit, ratione, voluptas? Accusamus dolor incidunt ipsum iure nemo rem sed voluptatum. Accusantium doloribus ducimus esse harum natus nobis provident rem ut. Deleniti dolorum neque nulla quis rem? Ullam, unde?'
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						// required
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

export default Step3;