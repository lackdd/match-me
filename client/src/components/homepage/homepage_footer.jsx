import './homepage_footer.scss'
import {Link} from 'react-router-dom'

function HomePageFooter() {
	return (
		<footer className={'homepage-footer'}>
			<Link to='https://www.facebook.com/' target="_blank" rel="noopener noreferrer">
				<span>
					<img src='/facebook_icon.svg' alt='Facebook' className='icon'/>
				</span>
			</Link>
			<Link to='https://www.instagram.com/' target="_blank" rel="noopener noreferrer">
				<span>
					<img src='/instagram_icon.svg' alt='Instragram' className='icon'/>
				</span>
			</Link>
			<Link to='https://www.x.com/' target="_blank" rel="noopener noreferrer">
				<span>
					<img src='/x_icon.svg' alt='X' className='icon'/>
				</span>
			</Link>
			<Link to='https://www.youtube.com/' target="_blank" rel="noopener noreferrer">
				<span>
					<img src='/youtube_icon.svg' alt='Youtube' className='icon'/>
				</span>

			</Link>
			<Link to='https://www.spotify.com/' target="_blank" rel="noopener noreferrer">
				<span>
				<img src='/spotify_icon.svg' alt='Spotify' className='icon'/>
				</span>
			</Link>
		</footer>
	)
}

export default HomePageFooter;