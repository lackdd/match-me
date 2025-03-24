import React, {useContext, useEffect, useRef, useState} from 'react';
import './dashboard.scss';
import '../reusables/settings-popup.scss'
import '../reusables/profile-card.scss'
import '../reusables/loadingAnimation.scss'
import { GiSettingsKnobs } from 'react-icons/gi';
import { FaSpotify } from 'react-icons/fa';
import {useSwipe} from '../recommendations/useSwipe.jsx';
import axios from 'axios';
import { useAuth } from '../utils/AuthContext.jsx';
import {
	formatData,
	formatLocation,
	closeSettings,
	openSettings,
	changeImage,
	backToObject
} from '../reusables/profile-card-functions.jsx';
import {DashboardForm} from './dashboardForm.jsx';
import {
	genderOptions,
	genreOptions, goalsOptions,
	interestsOptions,
	methodsOptions,
	personalityTraitsOptions
} from '../reusables/inputOptions.jsx';
import {AdvancedImage} from '@cloudinary/react';
import {getOptimizedImage} from '../utils/cloudinary.jsx';

function Dashboard() {
	const [loading, setLoading] = useState(true)
	const [loadingImage, setLoadingImage] = useState(false);
	const [myData, setMyData] = useState(null);
	const [myDataFormatted, setMyDataFormatted] = useState(null);
	const [liked, setLiked] = useState(0);
	const { tokenValue } = useAuth();
	const [formOpen, setFormOpen] = useState(false);
	const [imageUrl, setImageUrl] = useState(null); // todo if image is changed then change this. If this is available then use this to show image. Else you data from backend
	const isDataFormatted = useRef(false);

	const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

	// fetch user data
	useEffect(() => {
		const controller = new AbortController(); // Create an abort controller
		const signal = controller.signal;

			const getMyData = async() => {
				try {

					const [res1, res2, res3, res4] = await Promise.all([
						axios.get(`${VITE_BACKEND_URL}/api/me`, {
							headers: { Authorization: `Bearer ${tokenValue}` },
							signal
						}),
						axios.get(`${VITE_BACKEND_URL}/api/me/profile`, {
							headers: { Authorization: `Bearer ${tokenValue}` },
							signal
						}),
						// axios.get(`${VITE_BACKEND_URL}/api/me/bio`, {
						// 	headers: { Authorization: `Bearer ${tokenValue}` },
						// 	signal
						// }),
						axios.get(`${VITE_BACKEND_URL}/api/likedUsers`, {
							headers: { Authorization: `Bearer ${tokenValue}` },
							signal
						})
					]);

					console.log("Raw additionalInterests:", res2.data.additionalInterests);

					// formatting data (mostly to objects) for dashboard form
					const firstName = res1.data.username.split(' ')[0];
					const lastName = res1.data.username.split(' ')[1];
					const gender = genderOptions.find(gender => gender.value === res2.data.gender);
					const additionalInterests = backToObject(res2.data.additionalInterests, interestsOptions);
					const personalityTraits = backToObject(res2.data.personalityTraits, personalityTraitsOptions);
					const goalsWithMusic = backToObject(res2.data.goalsWithMusic, goalsOptions);
					const preferredMethod = backToObject(res2.data.preferredMethod, methodsOptions);
					const preferredMusicGenres = backToObject(res2.data.preferredMusicGenres, genreOptions);
					const location = res2.data.location ? {value: res2.data.location, label: res2.data.location} : "";


					// data for the form
					setMyData({
                        ...res1.data,
                        ...res2.data,
						firstName: firstName,
						lastName: lastName,
						gender: gender,
						additionalInterests,
						personalityTraits,
						goalsWithMusic,
						preferredMethod,
						preferredMusicGenres,
						location,
						// gender: res2.data.gender.charAt(0).toUpperCase() + res2.data.gender.slice(1)
                        // bio: res3.data
                    });

					// const formattedRes2 = formatDataForView(res2.data);

					// data for dashboard itself
					setMyDataFormatted( {
							...res1.data,
							...formatDataForView(res2.data),
					});

					setImageUrl(...res1.data.profilePicture)

					// liked users count
					if (res3.data.length) {
						setLiked(res3.data.length || 0);
					}


					console.log("Data fetched!");
				} catch (error) {
					if (axios.isCancel(error)) {
						console.log("Fetch aborted");
					} else {
						if (error.response) {
							console.error("Backend error:", error.response.data); // Server responded with an error
						} else {
							console.error("Request failed:", error.message); // Network error or request issue
						}
					}
				} finally {
					setLoading(false);
				}
			}
			getMyData();

		return () => controller.abort(); // Cleanup function to abort request
	}, [])


	const formatDataForView = (data) => {
		if (data !== null && data && isDataFormatted.current === false) {
			const updatedProfile = {
				...data,
				location: formatLocation(data.location),
				// location: myDataFormatted.location,
				preferredMusicGenres: Array.isArray(data.preferredMusicGenres)
					? formatData(data.preferredMusicGenres)
					: data.preferredMusicGenres,
				preferredMethod: Array.isArray(data.preferredMethod)
					? formatData(data.preferredMethod)
					: data.preferredMethod,
				additionalInterests: Array.isArray(data.additionalInterests)
					? formatData(data.additionalInterests)
					: data.additionalInterests,
				personalityTraits: Array.isArray(data.personalityTraits)
					? formatData(data.personalityTraits)
					: data.personalityTraits,
				goalsWithMusic: Array.isArray(data.goalsWithMusic)
					? formatData(data.goalsWithMusic)
					: data.goalsWithMusic
			};
			return updatedProfile;

			// Check if the profile data has changed before updating the state
			// if (JSON.stringify(updatedProfile) !== JSON.stringify(data)) {
			// 	setMyDataFormatted((prev) => ({
			// 		...prev,
			// 		...updatedProfile
			// 	}));
			// 	isDataFormatted.current = true;
			// }
		}
		return data;
	}

	useEffect(() => {
		console.log("MyDataFormatted: ", myDataFormatted);
	}, [myDataFormatted])

	return (

		<div className='dashboard-container'>

			{loading && (
				<div className={'spinner-container'}>
					<div className='spinner endless'>Loading profile...</div>
				</div>
			)}

			{!loading && (
				<>
				<div className="extra-dashboard-container">

					{/*<div className="settings-popup" id="picture-popup">*/}
					{/*	<div className="settings-content">*/}
					{/*		<div className='forms-container'>*/}
					{/*			*/}
					{/*		</div>*/}
					{/*	</div>*/}
					{/*</div>*/}

					<div className="settings-popup" id="settings-popup">
						<div className="settings-content">
							<div className='forms-container'>
								<DashboardForm myData={myData} setMyData={setMyData} setMyDataFormatted={setMyDataFormatted} formatDataForView={formatDataForView}/>
							</div>
						</div>
					</div>

					<div
						// ref={matchContainerRef}
						id="match-container"
						className="profile-card-container"
					>
						<div className="settings-container">
							<button className="settings-button" onClick={() => {
								openSettings();
								setFormOpen(true);
								// console.log("gender when opening settings: ", myData.gender);
							}}>
								<GiSettingsKnobs />
							</button>
						</div>

						<div className="picture-bio-container">
							<div className="picture-container">
								<div className="extra-picture-container">

									{/* todo fix so uploaded pictures are actually shown*/}
									{/*<label className={"choose-picture"}>*/}

									{/*{!loadingImage && imageUrl && <AdvancedImage cldImg={getOptimizedImage(imageUrl)} />}*/}

									{loadingImage && (
										<div className="loading-image">
											<div className={'spinner-container'}>
												<div className='spinner endless'>Loading picture...</div>
											</div>
										</div>
									)}

									{!loadingImage && (
										<>
										<input type='file'
											   accept={"image/*"}
											   name={'image'}
											   onChange={(event) => changeImage(event, setMyDataFormatted, setImageUrl, tokenValue, setLoadingImage)}
											   className='file-upload'
											   title={'click to change picture'}
										/>
										{myDataFormatted.gender === 'male' && (
											<img
											src="profile_pic_male.jpg"
											alt="profile picture"
											className="profile-picture"
											// onClick={changePicture(myDataFormatted, setMyDataFormatted)}
											/>
											)}
										{myDataFormatted.gender === 'female' && (
											<img
											src="profile_pic_female.jpg"
											alt="profile picture"
											className="profile-picture"
											/>
											)}
										{myDataFormatted.gender === 'other' && (
											<img
											src="default_profile_picture.png"
											alt="profile picture"
											className="profile-picture"
											/>
											)}
										</>
										)}

									{myDataFormatted.linkToMusic && (
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
										<td style={{ width: '60%' }}>{myDataFormatted.location}</td>
										<td style={{ width: '4%' }}></td>
										<td style={{ width: '36%' }}>
											{myDataFormatted.yearsOfMusicExperience === 1
												? `${myDataFormatted.yearsOfMusicExperience} year`
												: `${myDataFormatted.yearsOfMusicExperience} years`}
										</td>
									</tr>
									<tr>
										<th className="one-column" colSpan={3}>
											Genres
										</th>
									</tr>
									<tr>
										<td colSpan={3}>{myDataFormatted.preferredMusicGenres}</td>
									</tr>
									<tr>
										<th className="one-column" colSpan={3}>
											Methods
										</th>
									</tr>
									<tr>
										<td colSpan={3}>{myDataFormatted.preferredMethod}</td>
									</tr>
									<tr>
										<th className="one-column" colSpan={3}>
											Interests
										</th>
									</tr>
									<tr>
										<td colSpan={3}>{myDataFormatted.additionalInterests}</td>
									</tr>
									<tr>
										<th className="one-column" colSpan={3}>
											Personality
										</th>
									</tr>
									<tr>
										<td colSpan={3}>{myDataFormatted.personalityTraits}</td>
									</tr>
									<tr>
										<th className="one-column" colSpan={3}>
											Goals
										</th>
									</tr>
									<tr>
										<td colSpan={3}>{myDataFormatted.goalsWithMusic}</td>
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
										<td style={{ width: '48%' }}>{myDataFormatted.location}</td>
										<td style={{ width: '4%' }}></td>
										<td style={{ width: '48%' }}>
											{myDataFormatted.yearsOfMusicExperience === 1
												? `${myDataFormatted.yearsOfMusicExperience} year`
												: `${myDataFormatted.yearsOfMusicExperience} years`}
										</td>
									</tr>
									<tr>
										<th style={{ width: '48%' }} className="two-column">Genres</th>
										<td style={{ width: '4%' }}></td>
										<th style={{ width: '48%' }} className="two-column">Methods</th>
									</tr>
									<tr>
										<td style={{ width: '48%' }}>{myDataFormatted.preferredMusicGenres}</td>
										<td style={{ width: '4%' }}></td>
										<td style={{ width: '48%' }}>{myDataFormatted.preferredMethod}</td>
									</tr>
									<tr>
										<th style={{ width: '48%' }} className="two-column">Interests</th>
										<td style={{ width: '4%' }}></td>
										<th style={{ width: '48%' }} className="two-column">Personality</th>
									</tr>
									<tr>
										<td style={{ width: '48%' }}>{myDataFormatted.additionalInterests}</td>
										<td style={{ width: '4%' }}></td>
										<td style={{ width: '48%' }}>{myDataFormatted.personalityTraits}</td>
									</tr>
									<tr>
										<th colSpan={3}>Goals</th>
									</tr>
									<tr>
										<td colSpan={3}>{myDataFormatted.goalsWithMusic}</td>
									</tr>
									</tbody>
								</table>
							</div>
						</div>

						<div className="description-container">{myDataFormatted.description}</div>

						<div className="name-container">
							<span className="name">{myDataFormatted.username}</span>
							<br />
							<span>
							{myDataFormatted.age}, {myDataFormatted.gender}
						</span>
						</div>
					</div>
				</div>

					<div className='user-stats-container'>
						<div className='user-stats'>You have liked {liked} {liked === 1 ? "jammer" : "jammers"}</div>
					</div>

				</>
			)}
		</div>
	);
}

export default Dashboard;