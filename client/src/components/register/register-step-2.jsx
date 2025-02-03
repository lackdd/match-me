
// step 2 of registration
function Step2({goal, setGoal,
			   experience, setExperience,
			   location, setLocation,
               musicLink, setMusicLink,
               additionalInterests, setAdditionalInterests,
               personalityTraits, setPersonalityTraits,
               preferredMethods, setPreferredMethods,
			   preferredGenres, setPreferredGenres,
               description, setDescription,
               DeductStep, AddStep,
			   error, setError}) {

	return (

		<form className='step-two'>
			<div className='form-title'>
				<h1>Tell us about yourself</h1>
			</div>
			<div className={'line large'}>
				<label id='genres'>
					Preferred music genres*
					<br/>
					<input
						type='text'
						id='genres'
						className={`${error ? 'error-border' : ''}`}
						placeholder='Choose 1-3 genres'
						value={preferredGenres}
						onChange={(e) => setPreferredGenres(e.target.value)}
						// required
					/>
				</label>
			</div>
			<div className={'line large'}>
				<label id='methods'>
					Preferred methods*
					<br/>
					<input
						type='text'
						id='methods'
						className={`${error ? 'error-border' : ''}`}
						placeholder='Choose 1-3 methods'
						value={preferredMethods}
						onChange={(e) => setPreferredMethods(e.target.value)}
						// required
					/>
				</label>
			</div>
			<div className={'line large'}>
				<label id='interests'>
					Additional interests*
					<br/>
					<input
						type='text'
						id='interests'
						className={`${error ? 'error-border' : ''}`}
						placeholder='Choose 1-3 interests'
						value={additionalInterests}
						onChange={(e) => setAdditionalInterests(e.target.value)}
						// required
					/>
				</label>
			</div>
			<div className={'line large'}>
				<label id='personality'>
					Personality traits*
					<br/>
					<input
						type='text'
						id='personality'
						className={`${error ? 'error-border' : ''}`}
						placeholder='Choose 1-3 traits'
						value={personalityTraits}
						onChange={(e) => setPersonalityTraits(e.target.value)}
						// required
					/>
				</label>
			</div>
			<div className={'line'}>
				<label id='goal' className={'short'}>
					What is your goal?*
					<br/>
					<input
						type='text'
						id='goal'
						placeholder='Choose a goal'
						className={`short ${error ? 'error-border' : ''}`}
						value={goal}
						onChange={(e) => setGoal(e.target.value)}
						required
					/>
				</label>
				<label id='experience' className={'short'}>
					Years of music experience*
					<br/>
					<input
						type='text'
						id='experience'
						className={`short ${error ? 'error-border' : ''}`}
						placeholder='Enter number of years'
						value={experience}
						onChange={(e) => setExperience(e.target.value)}
						required
					/>
				</label>
			</div>
			<div className={'line'}>
				{/* todo searchable location https://www.npmjs.com/package/react-select-places*/}
				<label id='location' className={'short'}>
					Location*
					<br/>
					<input
						type='text'
						id='location'
						className={`short ${error ? 'error-border' : ''}`}
						placeholder='Set your location'
						value={location}
						onChange={(e) => setLocation(e.target.value)}
						required
					/>
				</label>
				<label id='music' className={'short'}>
					Link to your music
					<br/>
					<input
						type='url'
						id='music'
						className={`short ${error ? 'error-border' : ''}`}
						placeholder='Link to tour Spotify etc'
						value={musicLink}
						onChange={(e) => setMusicLink(e.target.value)}
					/>
				</label>
			</div>
			<div className={'line large'}>
				<label id='description'>
					Personality traits*
					<br/>
					<input
						type='text'
						id='description'
						className={`${error ? 'error-border' : ''}`}
						placeholder='Choose 1-3 traits'
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
					onClick={DeductStep}>
					Previous
				</button>
				{/*</label>*/}
				{/*<label>*/}
				<button
					className='next wide narrow'
					onClick={AddStep}>
					Next
				</button>
				{/*</label>*/}
			</div>
		</form>
	);
}

export default Step2;