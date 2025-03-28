import './recommendations.scss'
import '../reusables/profile-card.scss'
import '../reusables/settings-popup.scss'
import '../register/loadingAnimation.scss'
import {FaPlay, FaSpotify} from 'react-icons/fa';
import {IoPlaySkipForward} from 'react-icons/io5';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {useSwipe} from './useSwipe.jsx';
import { formatData, formatLocation, closeSettings, openSettings } from '../reusables/profile-card-functions.jsx';

// react icons
import { GiSettingsKnobs } from "react-icons/gi";

function Recommendations() {
	const matchContainerRef = useRef(null);
	const [swipedCount, setSwipedCount] = useState(0);
	const [loading, setLoading] = useState(true);
	const [matchIDs, setMatchIDs] = useState(['']);
	const [matches, setMatches] = useState({});
	const [currentMatchNum, setCurrentMatchNum] = useState(0);
	const [currentMatch, setCurrentMatch] = useState({});
	const [fetchMoreMatches, setFetchMoreMatches] = useState(false);

	const token = useRef(sessionStorage.getItem("token"));

	const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

	const { handleTouchStart, handleTouchEnd, handleTouchMove } = useSwipe();

	useEffect(() => {

		if (currentMatchNum === 9) {
			setCurrentMatchNum(0);
			setFetchMoreMatches(prev => !prev);
		}

	}, [currentMatch])

	// fetch IDs of matched users
	useEffect(() => {
		const controller = new AbortController(); // Create an abort controller
		const signal = controller.signal;

		if (matchIDs.length <= 1) { // no need to fetch matches if already available
			const getAllMatches = async() => {
				try {
					// const response = await axios.get(`${VITE_BACKEND_URL}/api/recommendations`)
					const response = await axios.get(`${VITE_BACKEND_URL}/api/recommendations`, {
							headers: { Authorization: `Bearer ${token.current}` },
						signal,
						});
					// todo fetch matchIDs when creating an account (and additionally in the background when logging in) so fetching here can be skipped if matches are already available
					// todo add matchIDs to database and check if available before fetching
					setMatchIDs(response.data);
					if (response.data.length === 0) {
						setLoading(false);
					}
				} catch (error) {
					if (axios.isCancel(error)) {
						console.log("Fetch aborted");
					} else {
						if (error.response) {
							console.error("Backend error:", error.response.data); // Server responded with an error
						} else {
							console.error("Request failed:", error.message); // Network error or request issue
						}
						// todo display error to user
					}
				}
			}
			getAllMatches();
		} else {
			console.log("Matches already fetched:", matchIDs);
		}

		return () => controller.abort(); // Cleanup function to abort request
	}, [fetchMoreMatches])

	// if match ids are fetched from server then fetch the data for all the ids
	useEffect(() => {

		if (matchIDs.length > 1) {
			const getMatchData = async() => {
				try {
					// Create an array of promises that fetch both profile and user data for each match
					const matchPromises = matchIDs.map(id => {

						// fetch profile pic and name
						const profilePromise = axios.get(`${VITE_BACKEND_URL}/api/users/${id}/profile`, {
							headers: { Authorization: `Bearer ${token.current}` }
						});

						// fetch other bio data
						const userPromise = axios.get(`${VITE_BACKEND_URL}/api/users/${id}`, {
							headers: { Authorization: `Bearer ${token.current}` }
						});

						// Return both promises for the same id
						return Promise.all([profilePromise, userPromise]).then(([profile, user]) => ({
							...profile.data,   // Merge profile data
							...user.data       // Merge user data
						}));
					});

					// Wait for all promises to resolve
					const matchResults = await Promise.all(matchPromises);

					// Update the matches state with the merged data
					setMatches(matchResults);
					setLoading(false); // disable loading state
				} catch (error) {
					if (error.response) {
						console.error("Backend error:", error.response.data); // Server responded with an error
					} else {
						console.error("Request failed:", error.message); // Network error or request issue
					}
				}
			}
			getMatchData()
		} else {
			// setLoading(false); // disable loading state
			console.log("No match IDs to fetch data for");
			// setLoading(false);
		}


	}, [matchIDs])

	// just to log data
	useEffect(() => {
		console.log("Matches: ",  matches);
	}, [matches]);

	// //set format data
	// useEffect(() => {
	//
	// 	setCurrentMatch(prevMatch => {
	// 		if (!prevMatch) return prevMatch; // Ensure state is not undefined
	//
	// 		const newMatch = { ...prevMatch }; // Clone the object
	//
	// 		for (let key in newMatch) {
	// 			if (newMatch.hasOwnProperty(key)) {
	// 				// console.log(key + " => " + newMatch[key]);
	// 			}
	//
	// 			if (key === 'location') {
	// 				newMatch[key] = formatLocation(newMatch[key]); // Update location
	// 			} else if (Array.isArray(newMatch[key])) {
	// 				console.log("formatting data");
	// 				newMatch[key] = formatData([...newMatch[key]]); // Clone array before modifying
	// 			}
	// 		}
	//
	// 		return newMatch;
	// 	});
	//
	// }, [currentMatchNum, matches]);

	// useEffect(() => {
	// 	if (matches[currentMatchNum]) {
	// 		const formattedMatch = { ...matches[currentMatchNum] }; // Clone to avoid mutations
	//
	// 		for (let key in formattedMatch) {
	// 			if (key === 'location') {
	// 				formattedMatch[key] = formatLocation(formattedMatch[key]);
	// 			} else if (Array.isArray(formattedMatch[key])) {
	// 				console.log("formatting data");
	// 				formattedMatch[key] = formatData([...formattedMatch[key]]);
	// 			}
	// 		}
	//
	// 		// ✅ Only update if the match has actually changed
	// 		setCurrentMatch(prevMatch => {
	// 			return JSON.stringify(prevMatch) === JSON.stringify(formattedMatch) ? prevMatch : formattedMatch;
	// 		});
	// 	}
	// }, [currentMatchNum, matches]); // Ensure the effect runs when matches change

	// just to log data
	useEffect(() => {
		console.log("Current match data: ", currentMatch);
	}, [currentMatch]);


	// logic when user swipes left or right (likes or dislikes)
	const swipe = (likeOrDislike) => {
		const matchContainer = matchContainerRef.current;
		if (!matchContainer) return;
		let swipedRight = true;

		setSwipedCount(prev => prev + 1 )

		if (likeOrDislike === "like") {
			console.log("Like!");
			matchContainer.classList.add("like-animation");
		}

		if (likeOrDislike === "dislike") {
			console.log("Dislike!");
			swipedRight = false;
			matchContainer.classList.add("dislike-animation");
		}

		console.log("current match id: ", currentMatch.id);

		// send data to backend
		const swipedUser = () => {
			try {
				axios.post(
					`${VITE_BACKEND_URL}/api/swiped`,
					null,
					{
						params: {
							matchId : currentMatch.id,
							swipedRight: swipedRight},
						headers: {
							"Authorization": `Bearer ${token.current}`,
							"Content-Type": "application/json"
						},
					}
				);
			} catch (error) {
				if (error.response) {
					console.error("Backend error:", error.response.data); // Server responded with an error
				} else {
					console.error("Request failed:", error.message); // Network error or request issue
				}
			}
		};

		swipedUser();

		setTimeout(() => {
			resetPosition({ target: matchContainer });
		}, 600); // Match the CSS transition duration
	};

	// logic to reset the position of matchContainer after like and dislike animation
	const resetPosition = useCallback((event) => {
		console.log("Resetting position...");
		const matchContainer = matchContainerRef.current;

		if (!matchContainer || event.target !== matchContainer) return;

		matchContainer.classList.remove("like-animation");
		matchContainer.classList.remove("dislike-animation");

		// Force reflow to apply the changes instantly
		void matchContainer.offsetWidth;

		// matchContainer.style.transition = "transform 0.75s 0.1s ease-in"; // Restore transition property

		// Load next match
		loadNextMatch();
	}, []);

	const formatMatchData = (matchData) => {
		const newMatch = { ...matchData };  // Clone to avoid mutations

		for (let key in newMatch) {
			if (key === 'location') {
				newMatch[key] = formatLocation(newMatch[key]);
			} else if (Array.isArray(newMatch[key])) {
				newMatch[key] = formatData([...newMatch[key]]);
			}
		}

		return newMatch;
	};

	// load next match data
	const loadNextMatch = useCallback(() => {
		console.log("Loading next match...");

		// Logic to update match profile with new data
		setCurrentMatchNum(prevState => prevState + 1)

	}, []);

	// set current match data
	useEffect(() => {
		const formattedMatch = formatMatchData(matches[currentMatchNum]);

		setCurrentMatch(formattedMatch);
	}, [currentMatchNum, matches]);

	// // todo doesnt work because it needs matchContainer to be available but it's available only when currentMatch is available but using currentMatch as dependency causes the evenlistener to be added and removed on every like/dislike click
	// //handle event listener every time user clicks on like or dislike
	// useEffect(() => {
	// 	const matchContainer = matchContainerRef.current;
	// 	if (!matchContainer) {
	// 		console.log("match container not found");
	// 		return;
	// 	}
	//
	// 	console.log("Adding event listener on transitionend");
	// 	// Add event listener once
	// 	matchContainer.addEventListener("transitionend", resetPosition);
	//
	// 	// Cleanup function to remove listener when component unmounts
	// 	return () => {
	// 		console.log("Removing event listener on transitionend");
	// 		matchContainer.removeEventListener("transitionend", resetPosition);
	// 	};
	// }, [matches]);


	return (
		<>
		<div className='recommendations-container'>
			<div className='settings-popup' id={'settings-popup'}>
				<div className='settings-content'>

					<form action=''>
						{/* todo add register step 5 form here auto filled with current user preferences data and add ability to change data*/}
					</form>

					<div className='settings-buttons-container'>

						<button className='save' onClick={closeSettings}>
							save
						</button>

						<button className='cancel' onClick={closeSettings}>
							cancel
						</button>

					</div>
				</div>
			</div>

		{loading ? (
			<div className={'spinner-container'}>
				<div className='spinner endless'>Finding matches...</div>
			</div>
		) : currentMatch ? (
			<>
			<div
				key={currentMatchNum}
				ref={matchContainerRef}
				id={'match-container'}
				className='profile-card-container'>

				<div className='settings-container'>
					<button className='settings-button' onClick={openSettings}>
						<GiSettingsKnobs />
					</button>
				</div>

				<div className='picture-bio-container'>
					<div className='picture-container'>
						<div className='extra-picture-container'>
							{/*{currentMatch.profilePicture ? (*/}
							{/*	<AdvancedImage cldImg={getOptimizedImage(currentMatch.profilePicture)}/>*/}
							{/*) : (*/}
							{/*	<img*/}
							{/*		src='default_profile_picture.png'*/}
							{/*		alt='profile picture'*/}
							{/*		className='profile-picture'*/}
							{/*	/>*/}
							{/*)}*/}
							{currentMatch.gender === 'male' && (
								<img
									src='profile_pic_male.jpg'
									alt='profile picture'
									className='profile-picture'
								/>
							)}
							{currentMatch.gender === 'female' && (
								<img
									src='profile_pic_female.jpg'
									alt='profile picture'
									className='profile-picture'
								/>
							)}
							{currentMatch.gender === 'other' && (
								<img
									src='default_profile_picture.png'
									alt='profile picture'
									className='profile-picture'
								/>
							)}
							{currentMatch.linkToMusic ? (
								<div className='music-link'>
									<FaSpotify style={{ color: '#31D165' }} />
								</div>
							) : ("")
							}

						</div>
					</div>

					{/* bigger screen design*/}
					<div className='bio-container default'>

						<table className='bio-table'>
							<tbody>
							<tr>
								<th style={{ width: '60%' }} className='two-column'>
									Location
								</th>
								<td style={{ width: '4%' }}></td>
								<th style={{ width: '36%' }} className='two-column'>
									Experience
								</th>
							</tr>
							<tr>
								<td style={{ width: '60%' }}>{currentMatch.location}</td>
								<td style={{ width: '4%' }}></td>
								<td style={{ width: '36%' }}>
									{currentMatch.yearsOfMusicExperience === 1
										? `${currentMatch.yearsOfMusicExperience} year`
										: `${currentMatch.yearsOfMusicExperience} years`}
								</td>
							</tr>
							<tr>
								<th className='one-column' colSpan={3}>
									Genres
								</th>
							</tr>
							<tr>
								<td colSpan={3}>{currentMatch.preferredMusicGenres}</td>
							</tr>
							<tr>
								<th className='one-column' colSpan={3}>
									Methods
								</th>
							</tr>
							<tr>
								<td colSpan={3}>{currentMatch.preferredMethod}</td>
							</tr>
							<tr>
								<th className='one-column' colSpan={3}>
									Interests
								</th>
							</tr>
							<tr>
								<td colSpan={3}>{currentMatch.additionalInterests}</td>
							</tr>
							<tr>
								<th className='one-column' colSpan={3}>
									Personality
								</th>
							</tr>
							<tr>
								<td colSpan={3}>{currentMatch.personalityTraits}</td>
							</tr>
							<tr>
								<th className='one-column' colSpan={3}>
									Goals
								</th>
							</tr>
							<tr>
								<td colSpan={3}>{currentMatch.goalsWithMusic}</td>
							</tr>
							</tbody>
						</table>
					</div>

				{/*	 mobile design */}

					<div className='bio-container mobile'>
						<table className='bio-table'>
							<tbody>
							<tr>
								<th style={{ width: '48%' }} className='two-column'>Location</th>
								<td style={{ width: '4%' }}></td>
								<th style={{ width: '48%' }} className='two-column'>Experience</th>
							</tr>
							<tr>
								<td style={{ width: '48%' }}>{currentMatch.location}</td>
								<td style={{ width: '4%' }}></td>
								<td style={{ width: '48%' }}>
									{currentMatch.yearsOfMusicExperience === 1
										? `${currentMatch.yearsOfMusicExperience} year`
										: `${currentMatch.yearsOfMusicExperience} years`}
								</td>
							</tr>
							<tr>
								<th style={{ width: '48%' }} className='two-column'>Genres</th>
								<td style={{ width: '4%' }}></td>
								<th style={{ width: '48%' }} className='two-column'>Methods</th>
							</tr>
							<tr>
								<td style={{ width: '48%' }}>{currentMatch.preferredMusicGenres}</td>
								<td style={{ width: '4%' }}></td>
								<td style={{ width: '48%' }}>{currentMatch.preferredMethod}</td>
							</tr>
							<tr>
								<th style={{ width: '48%' }} className='two-column'>Interests</th>
								<td style={{ width: '4%' }}></td>
								<th style={{ width: '48%' }} className='two-column'>Personality</th>
							</tr>
							<tr>
								<td style={{ width: '48%' }}>{currentMatch.additionalInterests}</td>
								<td style={{ width: '4%' }}></td>
								<td style={{ width: '48%' }}>{currentMatch.personalityTraits}</td>
							</tr>
							<tr>
								<th className='' colSpan={3}>Goals</th>
							</tr>
							<tr>
								<td colSpan={3} className={''}>{currentMatch.goalsWithMusic}</td>
							</tr>

							</tbody>
						</table>

					</div>
				</div>
				<div className='description-container'>
					{currentMatch.description}
				</div>
				<div className='name-container'>
					<span className='name'>{currentMatch.username}</span>
					<br />
					<span>{currentMatch.age}, {currentMatch.gender}</span>
				</div>
			</div>
			<div
				className='match-buttons-container'
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
			>
				<button className='dislike' onClick={() => swipe("dislike")}>
					<IoPlaySkipForward style={{ color: 'white', width: '70%', height: '70%' }} />
				</button>
				<button className='like' onClick={() => swipe("like")}>
					<FaPlay style={{ color: 'white', width: '55%', height: '55%' }} />
				</button>
			</div>

				<div className='user-stats-container'>
					<div className='user-stats'>{swipedCount} {swipedCount === 1 ? "swipe" : "swipes"}</div>
				</div>
			</>
		) : (
			<div className='no-matches'>
				<p>No more matches available.</p>
			</div>
		)}

		</div>
		</>
	);
}

export default Recommendations;
