import './recommendations.scss'
import {Link} from 'react-router-dom';
import {FaPlay, FaSpotify} from 'react-icons/fa';
import {IconContext} from 'react-icons';
import {FiSkipForward} from 'react-icons/fi';
import {IoPlaySkipForward} from 'react-icons/io5';

function Recommendations() {
	return (
		<div className='recommendations-container'>
			<div className='match-profile-container'>
				<div className='picture-bio-container flex-item'>
					<div className='picture-container'>
						<div className='extra-picture-container'>
							<img src='default_profile_picture.png' alt='profile picture'
								 className='match-profile-picture'/>
							<div className='music-link'>
								{/*todo dynamic icon based on what link user entered (spotify, soundcloud, youtube etc etc)*/}
								{/*todo ability to add multiple links and therefore multiple icons as links*/}
								{/*todo add warning that the user is being directed to another page*/}
								<FaSpotify style={{color: '#31D165'}}/>
							</div>
						</div>
					</div>
					<div className='bio-container'>
						<table className={'bio-table'}>
							<tbody>
							<tr>
								<th style={{width: '60%'}} className={'two-column'}>Location</th>
								<td style={{width: '4%'}}></td>
								{/* Spacer */}
								<th style={{width: '36%'}} className={'two-column'}>Experience</th>
							</tr>
							<tr>
								<td style={{width: '60%'}}>Tartu, Estonia</td>
								<td style={{width: '4%'}}></td>
								{/* Spacer */}
								<td style={{width: '36%'}}>2 years</td>
							</tr>
							<tr>
								<th className={'one-column'} colSpan={3}>Genres</th>
							</tr>
							<tr>
								<td colSpan={3}>country rock</td>
							</tr>
							<tr>
								<th className={'one-column'} colSpan={3}>Methods</th>
							</tr>
							<tr>
								<td colSpan={3}>singing guitar</td>
							</tr>
							<tr>
								<th className={'one-column'} colSpan={3}>Interests</th>
							</tr>
							<tr>
								<td colSpan={3}>farming riding horses</td>
							</tr>
							<tr>
								<th className={'one-column'} colSpan={3}>Personality</th>
							</tr>
							<tr>
								<td colSpan={3}>extroverted ambitious funny</td>
							</tr>
							<tr>
								<th className={'one-column'} colSpan={3}>Goals</th>
							</tr>
							<tr>
								<td colSpan={3}>make a band</td>
							</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div className='description-container flex-item'>Lorem ipsum dolor sit amet, consectetur adipisicing
					elit. A, alias, aliquam animi aperiam aspernatur assumenda consequatur, cupiditate deleniti dolorem
					doloribus ducimus eligendi et excepturi expedita inventore labore laborum modi mollitia nihil odio
					porro qui quibusdam repellendus tempora tenetur ullam unde voluptas. Amet, fuga velit? Dolor impedit
					natus nostrum repudiandae suscipit.
				</div>
				<div className='name-container flex-item'>
					<span className={'name'}>John Smith</span>
					<br/>
					<span>24, male</span>
				</div>
			</div>
			<div className='buttons-container'>
				<button
					className='dislike'
					onClick={() => {
						// add an animation to match-profile-container so it's border flashes red (also box shadow on each side) indicating that the user pressed dislike,
						//  after that slide match-profile-container to the left out of the screen and slide in a new match-profile-container from the right

					}}>
					<IoPlaySkipForward style={{color: 'white', width:'70%', height:'70%'}}/>
				</button>
				<button
					className='like'
					onClick={() => {

					}} >
					<FaPlay style={{color: 'white', width:'55%', height:'55%'}}/>
				</button>
			</div>
		</div>

	);
}

export default Recommendations;