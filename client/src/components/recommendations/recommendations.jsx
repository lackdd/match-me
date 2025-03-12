import './recommendations.scss'
import {FaPlay, FaSpotify} from 'react-icons/fa';
import {IoPlaySkipForward} from 'react-icons/io5';
import {useCallback, useEffect, useRef, useState} from 'react';
import axios from 'axios';
import '../register/loadingAnimation.scss'
import {getOptimizedImage} from '../utils/cloudinary.jsx';
import {AdvancedImage} from '@cloudinary/react';

function Recommendations() {
	const matchContainerRef = useRef(null);
	const [loading, setLoading] = useState(true)
	const [resetKey, setResetKey] = useState(0); // Forces re-render when match changes
	const [matchIDs, setMatchIDs] = useState(['']);
	const [matches, setMatches] = useState({});
	const [currentMatchNum, setCurrentMatchNum] = useState(0)
	const [currentMatch, setCurrentMatch] = useState({})

	const token = useRef(sessionStorage.getItem("token"));
	console.log("Token: ", token.current)

	const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


	// fetch IDs of matched users
	useEffect(() => {

		if (matchIDs.length <= 1) { // no need to fetch matches if already available
			const getAllMatches = async() => {
				try {
					// const response = await axios.get(`${VITE_BACKEND_URL}/api/recommendations`)
					const response = await axios.get(`${VITE_BACKEND_URL}/api/recommendations`, {
							headers: { Authorization: `Bearer ${token.current}` },
						}
					);
					// todo add matchIDS to database and check if available before fetching
					setMatchIDs(response.data);
				} catch (error) {
					console.error("Failed to get matches:", error);
				}
			}
			getAllMatches();
		} else {
			console.log("Matches already fetched:", matchIDs);
		}
	}, [])

	// if match ids are fetched from server the fetch the data for al the ids
	useEffect(() => {
		console.log(matchIDs);

		if (matchIDs.length > 1) {
			const getMatchData = async() => {
				try {
					// Create an array of promises that fetch both profile and user data for each match
					const matchPromises = matchIDs.map(id => {
						const profilePromise = axios.get(`${VITE_BACKEND_URL}/api/users/${id}/profile`, {
							headers: { Authorization: `Bearer ${token.current}` }
						});
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

				} catch (error) {
					console.error("Failed to get match data: ", error)
				} finally {
					setLoading(false);
				}
			}
			getMatchData()
		} else {
			console.log("No match IDs to fetch data for");
			// setLoading(false);
		}


	}, [matchIDs])

	useEffect(() => {
		setCurrentMatch(matches[currentMatchNum])
	}, [matches])

	useEffect(() => {
		console.log("Matches: ",  matches);
	}, [matches]);

	useEffect(() => {
		setCurrentMatch(matches[currentMatchNum])
	}, [currentMatchNum]);

	useEffect(() => {
		console.log("Current match data: ", currentMatch);
	}, [currentMatch]);


	// // todo check if useCallback should be used
	// const getMatchData = useCallback((matchIDs) => {
	//
	// })

	function Like() {
		const matchContainer = matchContainerRef.current;
		if (!matchContainer) return;

		// setCurrentMatchNum(prevState => prevState + 1)

		console.log("Like!");
		matchContainer.classList.add("like-animation");

		setTimeout(() => {
			resetPosition({ target: matchContainer });
		}, 600); // Match the CSS transition duration
	}

	function Dislike() {
		const matchContainer = matchContainerRef.current;
		if (!matchContainer) return;

		// setCurrentMatchNum(prevState => prevState + 1)

		console.log("Dislike!");
		matchContainer.classList.add("dislike-animation");

		setTimeout(() => {
			resetPosition({ target: matchContainer });
		}, 600); // Match the CSS transition duration
	}

	function resetPosition(event) {
		console.log("Resetting position...");
		const matchContainer = matchContainerRef.current;

		if (!matchContainer || event.target !== matchContainer) return;

		matchContainer.classList.remove("like-animation");
		matchContainer.classList.remove("dislike-animation");
		// setTimeout(() => {
		// 	matchContainer.classList.remove("like-animation");
		// 	matchContainer.classList.remove("dislike-animation");
		// }, 110); // Short delay ensures transition completes
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
		setCurrentMatchNum(prevState => prevState + 1)
	}

	// todo doesnt work
	// handle event listener every time user clicks on like or dislike
	useEffect(() => {
		const matchContainer = matchContainerRef.current;
		if (!matchContainer) return;

		console.log("Adding event listener on transitionend");
		// Add event listener once
		matchContainer.addEventListener("transitionend", resetPosition);

		// Cleanup function to remove listener when component unmounts
		return () => {
			console.log("Removing event listener on transitionend");
			matchContainer.removeEventListener("transitionend", resetPosition);
		};
	}, []);

	// // handle getting next match data from the database and then handle the event listener so the component is updated
	// useEffect(() => {
	// 	async function updateMatch() {
	//
	// 	}
	// }, [resetKey])


	const formatData = (data) => {
		for (let i = 0; i < data.length; i++) {
			data[i] = data[i].replaceAll("_", " ")

			if (i < data.length - 1) {
				data[i] = data[i] + ", "
			}

			// console.log(data[i]);
		}
		return data;
	}

	return (
		<>
		<div className='recommendations-container'>
		{loading ? (
			<div className={'spinner-container'}>
				<div className='spinner endless'>Finding matches...</div>
			</div>
		) : currentMatch ? (
			<>
			<div
				key={resetKey}
				ref={matchContainerRef}
				id={'match-container'}
				className='match-profile-container'>
				<div className='picture-bio-container flex-item'>
					<div className='picture-container'>
						<div className='extra-picture-container'>
							{/*{currentMatch.profilePicture ? (*/}
							{/*	<AdvancedImage cldImg={getOptimizedImage(currentMatch.profilePicture)}/>*/}
							{/*) : (*/}
							{/*	<img*/}
							{/*		src='default_profile_picture.png'*/}
							{/*		alt='profile picture'*/}
							{/*		className='match-profile-picture'*/}
							{/*	/>*/}
							{/*)}*/}
							<img
								src='default_profile_picture.png'
								alt='profile picture'
								className='match-profile-picture'
							/>
							<div className='music-link'>
								<FaSpotify style={{ color: '#31D165' }} />
							</div>
						</div>
					</div>
					<div className='bio-container'>
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
								<td colSpan={3}>{formatData(currentMatch.preferredMusicGenres)}</td>
							</tr>
							<tr>
								<th className='one-column' colSpan={3}>
									Methods
								</th>
							</tr>
							<tr>
								<td colSpan={3}>{formatData(currentMatch.preferredMethod)}</td>
							</tr>
							<tr>
								<th className='one-column' colSpan={3}>
									Interests
								</th>
							</tr>
							<tr>
								<td colSpan={3}>{formatData(currentMatch.additionalInterests)}</td>
							</tr>
							<tr>
								<th className='one-column' colSpan={3}>
									Personality
								</th>
							</tr>
							<tr>
								<td colSpan={3}>{formatData(currentMatch.personalityTraits)}</td>
							</tr>
							<tr>
								<th className='one-column' colSpan={3}>
									Goals
								</th>
							</tr>
							<tr>
								<td colSpan={3}>{formatData(currentMatch.goalsWithMusic)}</td>
							</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div className='description-container flex-item'>
					{currentMatch.description}
					{/*Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, alias, aliquam animi aperiam aspernatur*/}
					{/*assumenda consequatur, cupiditate deleniti dolorem doloribus ducimus eligendi et excepturi expedita*/}
					{/*inventore labore laborum modi mollitia nihil odio porro qui quibusdam repellendus tempora tenetur*/}
					{/*ullam unde voluptas. Amet, fuga velit? Dolor impedit natus nostrum repudiandae suscipit.*/}
				</div>
				<div className='name-container flex-item'>
					<span className='name'>{currentMatch.username}</span>
					<br />
					<span>{currentMatch.age}, {currentMatch.gender}</span>
				</div>
			</div>
			<div className='buttons-container'>
				<button className='dislike' onClick={Dislike}>
					<IoPlaySkipForward style={{ color: 'white', width: '70%', height: '70%' }} />
				</button>
				<button className='like' onClick={Like}>
					<FaPlay style={{ color: 'white', width: '55%', height: '55%' }} />
				</button>
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
