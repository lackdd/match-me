import './about.scss'
import Navigator from '../nav-bar-guest/nav-bar-guest.jsx';
import {useEffect, useRef, useState} from "react";

function About() {

	const [user, setUser] = useState({});
	const [profile, setProfile] = useState({});

	useEffect(() => {

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
			</div>
		</>

	);
}

export default About;
