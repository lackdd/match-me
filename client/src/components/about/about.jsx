import './about.scss'
import Navigator from '../nav-bar-guest/nav-bar-guest.jsx';
import {useEffect, useRef, useState} from "react";
import Chat from "../chats/Chat";

function About() {

	const [user, setUser] = useState({});
	const [profile, setProfile] = useState({});
	const [matchId, setMatchId] = useState("");



	/*useEffect(() => {

        fetch('http://localhost:8080/users/27')
            .then(response => response.json())
            .then(data => {
				console.log(data);
                setUser(data);
            })
    }, []);

	useEffect(() => {

		fetch('http://localhost:8080/users/27/profile')
			.then(response => response.json())
			.then(data => {
				console.log(data);
				setProfile(data);
			})
	}, []);

	useEffect(() => {

		fetch('http://localhost:8080/users/27/bio')
			.then(response => response.json())
			.then(data => {
				console.log(data);
			})
	}, []);

	// fetching /me data if user is logged in
	useEffect(() => {
		const token = sessionStorage.getItem("token");

		fetch('http://localhost:8080/me', {
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

		fetch('http://localhost:8080/me/profile', {
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

		fetch('http://localhost:8080/me/bio', {
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

	/*useEffect(() => {
		const token = sessionStorage.getItem("token");

		fetch('http://localhost:8080/recommendations', {
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

	useEffect(() => {
		const token = sessionStorage.getItem("token");

		fetch('http://localhost:8080/connections', {
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

	const addConnection = () => {
		const token = sessionStorage.getItem("token");
		const matchIdNumber = Number(matchId);

		fetch(`http://localhost:8080/addConnection?matchId=${matchIdNumber}`, {
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
				{user.username}
				<br/>
				<img src={user.profilePicture} alt="Profile" width="150"/>
				<br/>
				{profile.gender} {profile.age}
				<br/>
				{profile.linkToMusic}
				<br/>
				{profile.location}
				<br/>
				{profile.description}
				<br/>
				{profile.additionalInterests}
				<br/>
				{profile.personalityTraits}
				<br/>
				{profile.preferredMethods}
				{/*preferredMusicGenres and goalsWithMusic are also in use in register.jsx*/}
				{profile.preferredMusicGenres} {profile.goalsWithMusic} {profile.yearsOfMusicExperience}
				<h1 className={'coming-soon'}>About</h1>
				<br/>
				<h1 className={'coming-soon'}>Coming soon!</h1>
				<input
					type="number"
					value={matchId}
					onChange={(e) => setMatchId(e.target.value)}
					placeholder="Enter Match ID"
				/>
				<button onClick={addConnection}>Add match</button>
				{/* Chat Component */}
				<Chat />
			</div>
		</>

	);
}

export default About;
