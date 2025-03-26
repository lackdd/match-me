import './settings-menu.scss'
import { RiLockPasswordLine } from "react-icons/ri";
import { IoStatsChart } from "react-icons/io5";
import { FaUserEdit } from "react-icons/fa";

export function SettingsMenu({setSettingsContent}) {

	return (
		<nav className='settings-menu'>

			<div className='change-password'>
				<button onClick={() => setSettingsContent('password')} type={'button'}>
					<RiLockPasswordLine />
					password
				</button>
			</div>

			<div className='statistics'>
				<button onClick={() => setSettingsContent('statistics')} type={'button'}>
					<IoStatsChart />
					statistics
				</button>
			</div>

			<div className='edit-profile'>
				<button onClick={() => setSettingsContent('profile')} type={'button'}>
					<FaUserEdit />
					profile
				</button>
			</div>

		</nav>
	)
}