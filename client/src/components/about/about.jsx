import './about.scss'
import Navigator from '../nav-bar-guest/nav-bar-guest.jsx';
import {useEffect, useRef, useState} from "react";

function About() {

	const [user, setUser] = useState({});

	useEffect(() => {

        fetch('http://localhost:8080/users/27')
            .then(response => response.json())
            .then(data => {
				console.log(data);
                setUser(data);
            })
    }, []);

	return (
		<>
			{/*{Navigator()}*/}
			<div className='about-container'>
				{user.username}
				<br/>
				<img src={user.profilePicture} alt="Profile" width="150" />
				<h1 className={'coming-soon'}>About</h1>
				<br/>
				<h1 className={'coming-soon'}>Coming soon!</h1>
			</div>
		</>

	);
}

export default About;
