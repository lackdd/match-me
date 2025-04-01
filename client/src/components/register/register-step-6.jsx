import {useNavigate} from 'react-router-dom';
import '../reusables/loadingAnimation.scss';
import {useEffect, useState} from 'react';

// step 6 of registration
function Step6() {
	const navigate = useNavigate();
	const [text, setText] = useState('Creating account');

	useEffect(() => {
		const timer1 = setTimeout(() => {
			setText('Finding matches');
		}, 2000);
		const timer2 = setTimeout(() => {
			setText('Done!');
		}, 6000);
		const timer3 = setTimeout(() => {
			navigate('/dashboard');
		}, 8000);


		return () => {
			clearInterval(timer1);
			clearInterval(timer2);
			clearInterval(timer3);
		};
	}, [navigate]);


	return (
		<div className={'spinner-container'}>
			<div className='spinner'>
				{text}
			</div>
		</div>
	);
}

export default Step6;