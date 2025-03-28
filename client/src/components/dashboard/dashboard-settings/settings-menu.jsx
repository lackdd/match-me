import './settings-menu.scss'
import { RiLockPasswordLine } from "react-icons/ri";
import { IoStatsChart } from "react-icons/io5";
import { FaUserEdit } from "react-icons/fa";
import {useState} from 'react';

export function SettingsMenu({setSettingsContent}) {
	const [active, setActive] = useState('settings-profile-button');


	const changeActive = (event) => {

		document.getElementById(active)?.classList.remove('current');

		const currentElement = event.currentTarget.id;

		setActive(currentElement)

		document.getElementById(currentElement)?.classList.add('current');
	}

	return (
		<nav className='settings-menu'>

			<div className='change-password'>
				<button id={'settings-password-button'}
						onClick={(event) => {
					setSettingsContent('password');
					changeActive(event);
				}} type={'button'}>
					<RiLockPasswordLine />
					password
				</button>
			</div>

			<div className='statistics'>
				<button id={'settings-stats-button'} onClick={(event) => {
					setSettingsContent('statistics');
					changeActive(event);
				}} type={'button'}>
					<IoStatsChart />
					statistics
				</button>
			</div>

			<div className='edit-profile'>
				<button id={'settings-profile-button'}
						className={'current'}
						onClick={(event) => {
					setSettingsContent('profile');
					changeActive(event);
				}} type={'button'}>
					<FaUserEdit />
					profile
				</button>
			</div>

		</nav>
	)
}