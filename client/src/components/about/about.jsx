import './about.scss'
import Navigator from '../nav-bar-guest/nav-bar-guest.jsx';
import {useEffect, useRef, useState} from "react";

function About() {

	const [user, setUser] = useState({});

	useEffect(() => {

        fetch('http://localhost:8080/users/2')
            .then(response => response.json())
            .then(data => {
                setUser(data);
            })
    }, []);

	return (
		<>
			{/*{Navigator()}*/}
			<div className='about-container'>
				{user.email}
				<br/>
				{user.gender}
				<h1 className={'coming-soon'}>About</h1>
				<br/>
				<h1 className={'coming-soon'}>Coming soon!</h1>
			</div>
		</>

	);
}

export default About;
