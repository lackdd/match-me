import './recommendations.scss'
import {FaPlay, FaSpotify} from 'react-icons/fa';
import {IoPlaySkipForward} from 'react-icons/io5';
import {useEffect, useRef, useState} from 'react';

function Recommendations() {
	const matchContainerRef = useRef(null);
	const [resetKey, setResetKey] = useState(0); // Forces re-render when match changes

	function Like() {
		const matchContainer = matchContainerRef.current;
		if (!matchContainer) return;

		console.log("Like!");
		matchContainer.classList.add("like-animation");
	}

	function Dislike() {
		const matchContainer = matchContainerRef.current;
		if (!matchContainer) return;

		console.log("Dislike!");
		matchContainer.classList.add("dislike-animation");
	}

	function resetPosition(event) {
		console.log("Resetting position...");
		const matchContainer = matchContainerRef.current;

		if (!matchContainerRef.current || event.target !== matchContainerRef.current) return;

		matchContainer.classList.remove("like-animation"); // Remove animation
		matchContainer.classList.remove("dislike-animation"); // Remove animation
		// matchContainer.style.transition = "none"; // Disable transition temporarily
		// matchContainer.style.transform = "translateX(0)"; // Reset position

		// Force reflow to apply the changes instantly
		void matchContainer.offsetWidth;

		// matchContainer.style.transition = "transform 0.75s 0.1s ease-in"; // Restore transition property

		// Load next match
		loadNextMatch();
	}

	function loadNextMatch() {
		console.log("Loading next match...");

		// todo get the next match data from the database

		setResetKey(prevKey => prevKey + 1); // Force component to update
		// Logic to update match profile with new data
	}

	// handle event listener every time user clicks on like or dislike
	useEffect(() => {
		const matchContainer = matchContainerRef.current;
		if (!matchContainer) return;

		// Add event listener once
		matchContainer.addEventListener("transitionend", resetPosition);

		// Cleanup function to remove listener when component unmounts
		return () => {
			matchContainer.removeEventListener("transitionend", resetPosition);
		};
	}, [resetKey]);

	// handle getting next match data from the database and then handle the event listener so the component is updated
	useEffect(() => {
		async function updateMatch() {

		}
	}, [resetKey])

	return (
		<div className='recommendations-container'>
			{/*{!reset &&*/}
			{/*	(*/}
				<div
					key={resetKey}
					ref={matchContainerRef}
					id={'match-container'}
					// style={{ display: reset ? 'none' : 'block' }}
					className={`match-profile-container`}>
					<div className='picture-bio-container flex-item'>
						<div className='picture-container'>
							<div className='extra-picture-container'>
								<img src='default_profile_picture.png' alt='profile picture'
									 className='match-profile-picture'/>
								<div className='music-link'>
									{/*todo dynamic icon based on what link user entered (spotify, soundcloud, youtube etc etc)*/}
									{/*todo ability to add multiple links and therefore multiple icons as links*/}
									{/*todo add warning that the user is being directed to another page*/}
									<FaSpotify style={{color: '#31D165'}}/>
								</div>
							</div>
						</div>
						<div className='bio-container'>
							<table className={'bio-table'}>
								<tbody>
								<tr>
									<th style={{width: '60%'}} className={'two-column'}>Location</th>
									<td style={{width: '4%'}}></td>
									{/* Spacer */}
									<th style={{width: '36%'}} className={'two-column'}>Experience</th>
								</tr>
								<tr>
									<td style={{width: '60%'}}>Tartu, Estonia</td>
									<td style={{width: '4%'}}></td>
									{/* Spacer */}
									<td style={{width: '36%'}}>2 years</td>
								</tr>
								<tr>
									<th className={'one-column'} colSpan={3}>Genres</th>
								</tr>
								<tr>
									<td colSpan={3}>country rock</td>
								</tr>
								<tr>
									<th className={'one-column'} colSpan={3}>Methods</th>
								</tr>
								<tr>
									<td colSpan={3}>singing guitar</td>
								</tr>
								<tr>
									<th className={'one-column'} colSpan={3}>Interests</th>
								</tr>
								<tr>
									<td colSpan={3}>farming riding horses</td>
								</tr>
								<tr>
									<th className={'one-column'} colSpan={3}>Personality</th>
								</tr>
								<tr>
									<td colSpan={3}>extroverted ambitious funny</td>
								</tr>
								<tr>
									<th className={'one-column'} colSpan={3}>Goals</th>
								</tr>
								<tr>
									<td colSpan={3}>make a band</td>
								</tr>
								</tbody>
							</table>
						</div>
					</div>
					<div className='description-container flex-item'>Lorem ipsum dolor sit amet, consectetur adipisicing
						elit. A, alias, aliquam animi aperiam aspernatur assumenda consequatur, cupiditate deleniti
						dolorem
						doloribus ducimus eligendi et excepturi expedita inventore labore laborum modi mollitia nihil
						odio
						porro qui quibusdam repellendus tempora tenetur ullam unde voluptas. Amet, fuga velit? Dolor
						impedit
						natus nostrum repudiandae suscipit.
					</div>
					<div className='name-container flex-item'>
						<span className={'name'}>John Smith</span>
						<br/>
						<span>24, male</span>
					</div>
				</div>
			{/*)}*/}
			<div className='buttons-container'>
				<button
					className='dislike'
					onClick={() => {
						Dislike()
					}}>
					<IoPlaySkipForward style={{color: 'white', width: '70%', height: '70%'}}/>
				</button>
				<button
					className='like'
					onClick={() => {
						Like()
					}}>
					<FaPlay style={{color: 'white', width: '55%', height: '55%'}}/>
				</button>
			</div>
		</div>

	);
}

export default Recommendations;