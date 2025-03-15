import './nav-bar-guest.scss'
import {NavLink} from 'react-router-dom';

// mobile icons
import { FiLogIn } from "react-icons/fi";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import {useState} from 'react';

<IoClose />
function NavigatorGuest() {
	const [hamburger, setHamburger] = useState(false);

	return (
		<>
			<nav className='nav-container-guest default'>
				<div className='logo-container'>
					<NavLink to='/'>
						<img src='logo_black.png' alt='Jammer' className='nav-bar-logo'/>
					</NavLink>
				</div>
				<div className='links-container'>
					<NavLink to='/features' className={({ isActive }) =>
						`features ${isActive ? 'current' : ''}`
					}>
						FEATURES
					</NavLink>
					<NavLink to='/about' className={({ isActive }) =>
						`about ${isActive ? 'current' : ''}`
					}>
						ABOUT
					</NavLink>
					<NavLink to='/support' className={({ isActive }) =>
						`support ${isActive ? 'current' : ''}`
					}>
						SUPPORT
					</NavLink>
				</div>
				<div className='nav-buttons-container'>
					{/* again a tag to force rerender of nav bar*/}
					<NavLink to='/register'>
						<button className='button signup' title='Get started'>
							Get started
						</button>
					</NavLink>
					<NavLink to='/login'>
						<button className='button login' title='Log in'>
							Log in
						</button>
					</NavLink>

				</div>
			</nav>

			<nav className='nav-container-guest mobile'>
				<div className='logo-container'>
					<NavLink to='/'>
						<img src='icon_black.png' alt='Jammer' className='nav-bar-logo'/>
					</NavLink>
				</div>
				<div className='links-container'>

					<button
						// className={`hamburger ${hamburger ? "open" : "closed"}`}
						className="hamburger"
						title={'Menu'}
						onClick={() => setHamburger(!hamburger)}
					>
						{hamburger ? (
							<>
							<div className={`hamburger-links ${hamburger ? "open" : "closed"}`}>
								<NavLink to='/features' className={({ isActive }) =>
									`features ${isActive ? 'current' : ''}`
								}>
									Features
								</NavLink>
								<NavLink to='/about' className={({ isActive }) =>
									`about ${isActive ? 'current' : ''}`
								}>
									About
								</NavLink>
								<NavLink to='/support' className={({ isActive }) =>
									`support ${isActive ? 'current' : ''}`
								}>
									Support
								</NavLink>
								<NavLink to='/login' className={({ isActive }) =>
									`support ${isActive ? 'current' : ''}`
								}>
									Login
								</NavLink>
								<NavLink to='/register' className={({ isActive }) =>
									`support ${isActive ? 'current' : ''}`
								}>
									Register
								</NavLink>
							</div>
							<IoClose />
							</>
						) : (
							<RxHamburgerMenu />
						)}
						{/*{hamburger && <IoClose/>}*/}
					</button>
				</div>
					<div className='nav-buttons-container'>
						<NavLink to='/login'>
							<button className='mobile-login' title='Log in'>
								<FiLogIn />
							</button>
						</NavLink>
					</div>
				{/*<div className='buttons-container'>*/}
				{/*	/!* again a tag to force rerender of nav bar*!/*/}
				{/*	/!*<NavLink to='/register'>*!/*/}
				{/*	/!*	<button className='mobile-signup' title='Get started'>*!/*/}
				{/*	/!*		G*!/*/}
				{/*	/!*	</button>*!/*/}
				{/*	/!*</NavLink>*!/*/}
				{/*	<NavLink to='/login'>*/}
				{/*		<button className='mobile-login' title='Log in'>*/}
				{/*			L*/}
				{/*		</button>*/}
				{/*	</NavLink>*/}

				{/*</div>*/}
			</nav>
		</>

	);
}

export default NavigatorGuest;
