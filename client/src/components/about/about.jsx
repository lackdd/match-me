import './about.scss'
import Navigator from '../nav-bar-guest/nav-bar-guest.jsx';
import {useEffect, useRef, useState} from "react";
import Chat from "../chats/Chat";

function About() {

	const [user, setUser] = useState({});
	const [profile, setProfile] = useState({});
	const [matchId, setMatchId] = useState("");

	const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;



	/*useEffect(() => {

        fetch('/users/27')
            .then(response => response.json())
            .then(data => {
				console.log(data);
                setUser(data);
            })
    }, []);

	useEffect(() => {

		fetch('/users/27/profile')
			.then(response => response.json())
			.then(data => {
				console.log(data);
				setProfile(data);
			})
	}, []);

	useEffect(() => {

		fetch('/users/27/bio')
			.then(response => response.json())
			.then(data => {
				console.log(data);
			})
	}, []);

	// fetching /me data if user is logged in
	useEffect(() => {
		const token = sessionStorage.getItem("token");

		fetch('/api/me', {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json"
			}
		})
			.then(response => {
				if (!response.ok) {
					throw new Error("Unauthorized access");
				}
				return response.json();
			})
			.then(data => {
				console.log("/me data: ", data);
			})
			.catch(error => console.error("Error fetching /me:", error));
	}, []);

	// fetching /me/profile data if user is logged in
	useEffect(() => {
		const token = sessionStorage.getItem("token");

		fetch('/api/me/profile', {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json"
			}
		})
			.then(response => {
				if (!response.ok) {
					throw new Error("Unauthorized access");
				}
				return response.json();
			})
			.then(data => {
				console.log("/me/profile data: ", data);
			})
			.catch(error => console.error("Error fetching /me/profile:", error));
	}, []);

	// fetching /me/bio data if user is logged in
	useEffect(() => {
		const token = sessionStorage.getItem("token");

		fetch('/api/me/bio', {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json"
			}
		})
			.then(response => {
				if (!response.ok) {
					throw new Error("Unauthorized access");
				}
				return response.json();
			})
			.then(data => {
				console.log("/me/bio data: ", data);
			})
			.catch(error => console.error("Error fetching /me/bio:", error));
	}, []);*/

	useEffect(() => {
		const token = sessionStorage.getItem("token");

		fetch('/api/recommendations', {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json"
			}
		})
			.then(response => {
				if (!response.ok) {
					throw new Error("Unauthorized access");
				}
				return response.json();
			})
			.then(data => {
				console.log("/recommendations data: ", data);
			})
			.catch(error => console.error("Error fetching /recommendations:", error));
	}, []);

	/*useEffect(() => {
		const token = sessionStorage.getItem("token");

		fetch('/api/connections', {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json"
			}
		})
			.then(response => {
				if (!response.ok) {
					throw new Error("Unauthorized access");
				}
				return response.json();
			})
			.then(data => {
				console.log("/connections data: ", data);
			})
			.catch(error => console.error("Error fetching /connections:", error));
	}, []);*/
	// test

	const addConnection = () => {
		const token = sessionStorage.getItem("token");
		const matchIdNumber = Number(matchId);

		fetch(`/api/addConnection?matchId=${matchIdNumber}`, {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json"
			}
		})
			.then(response => {
				if (!response.ok) {
					throw new Error("Unauthorized access");
				}
				return response.json();
			})
			.then(data => {
				console.log("/addConnection data: ", data);
			})
			.catch(error => console.error("Error fetching /addConnection:", error));
	};

	return (
		<>
			{/*{Navigator()}*/}
			<div className='about-container'>

				<h1 className={'blinking-text'}>Jammer</h1>

				<img className={'background-image one'} src={'icon_black.png'} alt={''}/>
				<img className={'background-image two'} src={'icon_black.png'} alt={''}/>

				{/*{user.username}*/}
				{/*<br/>*/}
				{/*<img src={user.profilePicture} alt="Profile" width="150"/>*/}
				{/*<br/>*/}
				{/*{profile.gender} {profile.age}*/}
				{/*<br/>*/}
				{/*{profile.linkToMusic}*/}
				{/*<br/>*/}
				{/*{profile.location}*/}
				{/*<br/>*/}
				{/*{profile.description}*/}
				{/*<br/>*/}
				{/*{profile.additionalInterests}*/}
				{/*<br/>*/}
				{/*{profile.personalityTraits}*/}
				{/*<br/>*/}
				{/*{profile.preferredMethods}*/}
				{/*/!*preferredMusicGenres and goalsWithMusic are also in use in register.jsx*!/*/}
				{/*{profile.preferredMusicGenres} {profile.goalsWithMusic} {profile.yearsOfMusicExperience}*/}
				{/*<h1 className={'coming-soon'}>About</h1>*/}
				{/*<br/>*/}
				{/*<h1 className={'coming-soon'}>Coming soon!</h1>*/}
				<div className='about-text'>
					<p className={'left'}>
						At Jammer, we believe that music is a universal language that connects people from all corners of the world. Whether you’re a seasoned musician or just starting your musical journey, Jammer is here to help you find like-minded individuals to collaborate with, create, and jam together.
					</p>
					<p className={'right'}>
						Our platform brings musicians from diverse backgrounds and genres together in one space, making it
						easier than ever to connect with potential bandmates, find jam sessions, and share your passion for
						music. No matter where you are, Jammer is your global stage for musical discovery.
					</p>
					<p className={'mid'}>
						Join the Jammer community today, and let the music play!
					</p>
				</div>
				{/*<input*/}
				{/*	type="number"*/}
				{/*	value={matchId}*/}
				{/*	onChange={(e) => setMatchId(e.target.value)}*/}
				{/*	placeholder="Enter Match ID"*/}
				{/*/>*/}
				{/*<button onClick={addConnection}>Add match</button>*/}
				{/*/!* Chat Component *!/*/}
				{/*<Chat />*/}
			</div>
		</>

	);
}

export default About;
