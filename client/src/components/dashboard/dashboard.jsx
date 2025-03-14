import React, {useContext, useEffect, useRef, useState} from 'react';
import './dashboard.scss';
import '../reusables/settings-popup.scss'
import '../reusables/profile-card.scss'
import '../register/loadingAnimation.scss'
import { MatchForm } from './matchForm.jsx';
import { BioForm1 } from './bioForm-1.jsx';
import { GiSettingsKnobs } from 'react-icons/gi';
import { FaSpotify } from 'react-icons/fa';
import {useSwipe} from '../recommendations/useSwipe.jsx';
import axios from 'axios';

import { formatData, formatLocation, closeSettings, openSettings } from '../reusables/profile-card-functions.jsx';

function Dashboard() {
	const [loading, setLoading] = useState(true)
	const [myData, setMyData] = useState(null);

	const token = useRef(sessionStorage.getItem("token"));
	console.log("Token: ", token.current)

	const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

	// fetch user data
	useEffect(() => {
		const controller = new AbortController(); // Create an abort controller
		const signal = controller.signal;

			const getMyData = async() => {
				try {

					const [res1, res2, res3] = await Promise.all([
						axios.get(`${VITE_BACKEND_URL}/api/me`, {
							headers: { Authorization: `Bearer ${token.current}` },
							signal
						}),
						axios.get(`${VITE_BACKEND_URL}/api/me/profile`, {
							headers: { Authorization: `Bearer ${token.current}` },
							signal
						}),
						axios.get(`${VITE_BACKEND_URL}/api/me/bio`, {
							headers: { Authorization: `Bearer ${token.current}` },
							signal
						})
					])

					setMyData({
                        me: res1.data,
                        profile: res2.data,
                        bio: res3.data
                    })

					console.log("Data fetched!");
				} catch (error) {
					if (axios.isCancel(error)) {
						console.log("Fetch aborted");
					} else {
						console.error("Failed to get data:", error);
					}
				} finally {
					setLoading(false);
				}
			}
			getMyData();

		return () => controller.abort(); // Cleanup function to abort request
	}, [])

	useEffect(() => {

		console.log(myData);

	}, [myData])

	//format data
	useEffect(() => {
		if (myData !== null && myData.profile) {
			const updatedProfile = {
				...myData.profile,
				location: formatLocation(myData.profile.location),
				preferredMusicGenres: Array.isArray(myData.profile.preferredMusicGenres)
					? formatData(myData.profile.preferredMusicGenres)
					: myData.profile.preferredMusicGenres,
				preferredMethod: Array.isArray(myData.profile.preferredMethod)
					? formatData(myData.profile.preferredMethod)
					: myData.profile.preferredMethod,
				additionalInterests: Array.isArray(myData.profile.additionalInterests)
					? formatData(myData.profile.additionalInterests)
					: myData.profile.additionalInterests,
				personalityTraits: Array.isArray(myData.profile.personalityTraits)
					? formatData(myData.profile.personalityTraits)
					: myData.profile.personalityTraits,
				goalsWithMusic: Array.isArray(myData.profile.goalsWithMusic)
					? formatData(myData.profile.goalsWithMusic)
					: myData.profile.goalsWithMusic
			};

			// Check if the profile data has changed before updating the state
			if (JSON.stringify(updatedProfile) !== JSON.stringify(myData.profile)) {
				setMyData((prev) => ({
					...prev,
					profile: updatedProfile
				}));
			}
		}
	}, [myData]);

	return (
		<>
			{loading && (
				<div className={'spinner-container'}>
					<div className='spinner endless'>Loading profile...</div>
				</div>
			)}
		{loading === false && (
			<div className="dashboard-container">
				<div className="settings-popup" id="settings-popup">
					<div className="settings-content">
						<div className='forms-container'>
							<BioForm1/>
						</div>
						<div className="settings-buttons-container">
							<button className="save" onClick={closeSettings}>
								Save
							</button>
							<button className="cancel" onClick={closeSettings}>
								Cancel
							</button>
						</div>
					</div>
				</div>

				<div
					// ref={matchContainerRef}
					id="match-container"
					className="profile-card-container"
				>
					<div className="settings-container">
						<button className="settings-button" onClick={openSettings}>
							<GiSettingsKnobs />
						</button>
					</div>

					<div className="picture-bio-container">
						<div className="picture-container">
							<div className="extra-picture-container">
								{myData.profile.gender === 'male' && (
									<img
										src="profile_pic_male.jpg"
										alt="profile picture"
										className="profile-picture"
									/>
								)}
								{myData.profile.gender === 'female' && (
									<img
										src="profile_pic_female.jpg"
										alt="profile picture"
										className="profile-picture"
									/>
								)}
								{myData.profile.gender === 'other' && (
									<img
										src="default_profile_picture.png"
										alt="profile picture"
										className="profile-picture"
									/>
								)}
								{myData.profile.linkToMusic && (
									<div className="music-link">
										<FaSpotify style={{ color: '#31D165' }} />
									</div>
								)}
							</div>
						</div>

						<div className="bio-container default">
							<table className="bio-table">
								<tbody>
								<tr>
									<th style={{ width: '60%' }} className="two-column">
										Location
									</th>
									<td style={{ width: '4%' }}></td>
									<th style={{ width: '36%' }} className="two-column">
										Experience
									</th>
								</tr>
								<tr>
									<td style={{ width: '60%' }}>{myData.profile.location}</td>
									<td style={{ width: '4%' }}></td>
									<td style={{ width: '36%' }}>
										{myData.profile.yearsOfMusicExperience === 1
											? `${myData.profile.yearsOfMusicExperience} year`
											: `${myData.profile.yearsOfMusicExperience} years`}
									</td>
								</tr>
								<tr>
									<th className="one-column" colSpan={3}>
										Genres
									</th>
								</tr>
								<tr>
									<td colSpan={3}>{myData.profile.preferredMusicGenres}</td>
								</tr>
								<tr>
									<th className="one-column" colSpan={3}>
										Methods
									</th>
								</tr>
								<tr>
									<td colSpan={3}>{myData.profile.preferredMethod}</td>
								</tr>
								<tr>
									<th className="one-column" colSpan={3}>
										Interests
									</th>
								</tr>
								<tr>
									<td colSpan={3}>{myData.profile.additionalInterests}</td>
								</tr>
								<tr>
									<th className="one-column" colSpan={3}>
										Personality
									</th>
								</tr>
								<tr>
									<td colSpan={3}>{myData.profile.personalityTraits}</td>
								</tr>
								<tr>
									<th className="one-column" colSpan={3}>
										Goals
									</th>
								</tr>
								<tr>
									<td colSpan={3}>{myData.profile.goalsWithMusic}</td>
								</tr>
								</tbody>
							</table>
						</div>

						<div className="bio-container mobile">
							<table className="bio-table">
								<tbody>
								<tr>
									<th style={{ width: '48%' }} className="two-column">Location</th>
									<td style={{ width: '4%' }}></td>
									<th style={{ width: '48%' }} className="two-column">Experience</th>
								</tr>
								<tr>
									<td style={{ width: '48%' }}>{myData.profile.location}</td>
									<td style={{ width: '4%' }}></td>
									<td style={{ width: '48%' }}>
										{myData.profile.yearsOfMusicExperience === 1
											? `${myData.profile.yearsOfMusicExperience} year`
											: `${myData.profile.yearsOfMusicExperience} years`}
									</td>
								</tr>
								<tr>
									<th style={{ width: '48%' }} className="two-column">Genres</th>
									<td style={{ width: '4%' }}></td>
									<th style={{ width: '48%' }} className="two-column">Methods</th>
								</tr>
								<tr>
									<td style={{ width: '48%' }}>{myData.profile.preferredMusicGenres}</td>
									<td style={{ width: '4%' }}></td>
									<td style={{ width: '48%' }}>{myData.profile.preferredMethod}</td>
								</tr>
								<tr>
									<th style={{ width: '48%' }} className="two-column">Interests</th>
									<td style={{ width: '4%' }}></td>
									<th style={{ width: '48%' }} className="two-column">Personality</th>
								</tr>
								<tr>
									<td style={{ width: '48%' }}>{myData.profile.additionalInterests}</td>
									<td style={{ width: '4%' }}></td>
									<td style={{ width: '48%' }}>{myData.profile.personalityTraits}</td>
								</tr>
								<tr>
									<th colSpan={3}>Goals</th>
								</tr>
								<tr>
									<td colSpan={3}>{myData.profile.goalsWithMusic}</td>
								</tr>
								</tbody>
							</table>
						</div>
					</div>

					<div className="description-container">{myData.profile.description}</div>

					<div className="name-container">
						<span className="name">{myData.me.username}</span>
						<br />
						<span>
							{myData.profile.age}, {myData.profile.gender}
						</span>
					</div>
				</div>
			</div>
	)}
		</>
	);
}

export default Dashboard;