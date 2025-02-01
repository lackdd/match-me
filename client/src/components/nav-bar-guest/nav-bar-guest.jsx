import './nav-bar-guest.scss'
import {NavLink} from 'react-router-dom'


function NavigatorGuest() {
	return (
		<nav className='nav-container-guest'>
			<div className='logo-container'>
				<NavLink to='/'>
					<img src='logo_black.png' alt='Jammer' className='nav-bar-logo'/>
				</NavLink>
			</div>
			<div className='links-container'>
				<NavLink to='/features' className={'features'}>
					FEATURES
				</NavLink>
				<NavLink to='/about' className={'about'}>
					ABOUT
				</NavLink>
				<NavLink to='/support' className={'support'}>
					SUPPORT
				</NavLink>
			</div>
			<div className='buttons-container'>
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
	);
}

export default NavigatorGuest;
