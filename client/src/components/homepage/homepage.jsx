import './homepage.scss'
import HomePageFooter from './homepage_footer.jsx'
import {Link} from 'react-router-dom';

function HomePage() {
	return (
		<>
			<div className='homepage-container'>
				<div className={'hero-container'}>
					<h1 className={'hero-text'}>
						Love making music?
						<br/>
						<br/>
						Want to share that passion?
						<br/>
						<br/>
						Find other passionate musicians

						<span style={{display: 'block'}}>
							to jam with by joining Jammer
						</span>
					</h1>
					<div className={'cta-button-container'}>
						{/* again a tag to force rerender of nav bar*/}
						{/* todo need better solution so not everything gets rendered */}
						<a href={'/register'} title={"Get started"}>
							<button className={'cta-button'}>
								Get started now!
							</button>
						</a>
					</div>
				</div>
				<HomePageFooter/>
			</div>

		</>


	);
}

export default HomePage;