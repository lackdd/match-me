
// step 2 of registration
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import {customStyles} from './customInputStyles.jsx';

function Step3({experience, setExperience,
			   location, setLocation,
				country, setCountry,
				city, setCity,
               musicLink, setMusicLink,
               description, setDescription,
               DeductStep, AddStep,
                age,setAge,
			   error, setError}) {


	return (

		<form className='step-three'
			  onSubmit={(e) => {AddStep(e);}}
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
			<div className={'line'}>
				{/* todo searchable location https://www.npmjs.com/package/react-select-places*/}

				<label id='country' className={'short'}>
					Country*
					<br/>
					{/*<Select>*/}
				</label>
				<label id='city' className={'short'}>
					City*
					<br/>
					<input
						type='text'
						id='city'
						className={`not-react-select focus-highlight short ${error ? 'error-border' : ''}`}
						placeholder='Choose city'
						value={location}
						onChange={(e) => setLocation(e.target.value)}
						// required
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