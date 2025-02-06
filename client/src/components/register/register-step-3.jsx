
// step 2 of registration
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import {customStyles} from './customInputStyles.jsx';
import {useCallback, useEffect, useRef, useState} from 'react';

function Step3({formThreeData, setFormThreeData, stepFunctions, handleChangeDataReactSelect, handleChangeDataDefault, error, setError}) {


	const [inputValue, setInputValue] = useState("");
	const [options, setOptions] = useState([]);
	const autocompleteServiceRef = useRef(null);

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
			  onSubmit={(e) => {
				  stepFunctions.AddStep(e);
			  }}
			  autoComplete={"on"}
		>
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
						className={`not-react-select focus-highlight short ${error ? 'error-border' : ''}`}
						placeholder='Enter number of years'
						value={formThreeData.experience}
						onChange={(e) => handleChangeDataDefault(e, setFormThreeData)}
						min={0}
						max={formThreeData.age}
						// required
					/>
				</label>
				<label id='music' className={'short'}>
					Link to your music
					<br/>
					<input
						type='url'
						id='music'
						name={'musicLink'}
						className={`not-react-select focus-highlight short ${error ? 'error-border' : ''}`}
						placeholder='Link to your Spotify etc'
						value={formThreeData.musicLink}
						onChange={(e) => handleChangeDataDefault(e, setFormThreeData)}
					/>
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
						onChange={(selectedOption) => handleChangeDataReactSelect('location', selectedOption, setFormThreeData)}
						placeholder="Search for your city"
						isClearable={true}
						styles={customStyles}
						wideMenu={true}
						closeMenuOnSelect={true}
						value={formThreeData.location}
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
						name={'description'}
						className={`description-container focus-highlight ${error ? 'error-border' : ''}`}
						placeholder='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut consequatur cupiditate error eveniet hic qui reiciendis rerum tenetur? Deserunt eos laboriosam minima nihil praesentium repellendus reprehenderit saepe tenetur vel, velit? Fugit, ratione, voluptas? Accusamus dolor incidunt ipsum iure nemo rem sed voluptatum. Accusantium doloribus ducimus esse harum natus nobis provident rem ut. Deleniti dolorum neque nulla quis rem? Ullam, unde?'
						value={formThreeData.description}
						onChange={(e) => handleChangeDataDefault(e, setFormThreeData)}
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
					type={'submit'}
				>
					Next
				</button>
			</div>
		</form>
	);
}

export default Step3;