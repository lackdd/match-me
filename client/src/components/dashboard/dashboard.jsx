// WelcomeDashboard.js
import React, {useContext} from 'react';
import './dashboard.scss'
import {MatchForm} from './matchForm.jsx';
import {BioForm1} from './bioForm-1.jsx';

function Dashboard() {

	return (
		<div className="dashboard-container">
			{/*<div className="coming-soon">*/}
			{/*	<h2 className="mb-4 text-center">Welcome to Dashboard</h2>*/}
			{/*	<p className="mb-4 text-center">Hello, {username}!</p>*/}
			{/*	<p className="text-center">You are logged in successfully.</p>*/}
			{/*	<div className="text-center">*/}
			{/*		<button type="button" className="btn btn-primary mt-3" onClick={handleLogout}>Logout</button>*/}
			{/*	</div>*/}
			{/*</div>*/}
			<div className={'picture-container grid-item'}>
				<img src={'default_profile_picture.png'} alt={'default picture'}/>
				<div className='change-picture'>
					{/*todo add picture change functionality (same as in signup step 4*/}
					<label className={"change-picture-button"}>
						<input type='file'
							   accept={"image/*"}
							   name={'image'}
							// onChange={onImageChange}
							   className='file-upload'/>
						Change picture
					</label>
				</div>
			</div>
			<div className='flex-border'></div>
			<div className={'form-container bio-1 grid-item'}>
				<BioForm1/>
			</div>
			<div className='flex-border'></div>
			<div className={'form-container match grid-item'}>
				<MatchForm/>
			</div>
		</div>
	);
}

export default Dashboard;
