import './homepage.scss'
import HomePageFooter from './homepage_footer.jsx'
import {Link, Navigate, useOutletContext} from 'react-router-dom';
import {useContext} from "react";
import {AuthContext} from "../../App.jsx";

function HomePage() {

	const {isUserLoggedIn, setIsUserLoggedIn} = useContext(AuthContext);

	if (isUserLoggedIn == true) {
		return <Navigate to="/dashboard" replace />;
	}

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
						<Link to={{pathname:'/register'}} title={"Get started"}>
							<button className={'cta-button'}>
								Get started now!
							</button>
						</Link>
					</div>
				</div>
				<HomePageFooter/>
			</div>

		</>


	);
}

export default HomePage;
