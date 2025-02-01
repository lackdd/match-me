
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
			{/*<div className={'line large'}>*/}
			{/*	<label id='email'>*/}
			{/*		Email address**/}
			{/*		<br/>*/}
			{/*		<input*/}
			{/*			type='email'*/}
			{/*			id='email'*/}
			{/*			className={`${error ? 'error-border' : ''}`}*/}
			{/*			placeholder='Enter your email address'*/}
			{/*			value={email}*/}
			{/*			onChange={(e) => setEmail(e.target.value)}*/}
			{/*			required*/}
			{/*		/>*/}
			{/*	</label>*/}
			{/*</div>*/}
			{/*<div className={'line large'}>*/}
			{/*	<label id='password'>*/}
			{/*		Password**/}
			{/*		<br/>*/}
			{/*		<input*/}
			{/*			type='password'*/}
			{/*			id='password'*/}
			{/*			className={`${error ? 'error-border' : ''}`}*/}
			{/*			placeholder='Enter a password'*/}
			{/*			value={password}*/}
			{/*			onChange={(e) => setPassword(e.target.value)}*/}
			{/*			required*/}
			{/*		/>*/}
			{/*	</label>*/}
			{/*</div>*/}
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