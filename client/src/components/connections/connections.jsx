import './connections.scss'
import {Link} from 'react-router-dom';

function Connections() {
	return (
		<div className='connections-container'>

			<div className='extra-connections-container'>

				<div className='buttons-container'>

					<button className='current'>Current connections</button>

					<button className='pending'>Pending connections</button>

				</div>

				<div className='connections-list'>

					<div className='connection'>
						<div className='picture-container'>
							<img src='' alt=''/>
						</div>
						<div className='name'>
							John Smith
						</div>
						<div className='connections-buttons-container'>
							<button className='yes'>yes</button>
							<button className='no'>no</button>
						</div>
					</div>
					<div className='connection'>John Smith</div>
					<div className='connection'>John Smith</div>
					<div className='connection'>John Smith</div>
					<div className='connection'>John Smith</div>
					<div className='connection'>John Smith</div>
					<div className='connection'>John Smith</div>
					<div className='connection'>John Smith</div>
					<div className='connection'>John Smith</div>
					<div className='connection'>John Smith</div>
					<div className='connection'>John Smith</div>
					<div className='connection'>John Smith</div>
					<div className='connection'>John Smith</div>
					<div className='connection'>John Smith</div>
					<div className='connection'>John Smith</div>

				</div>
			</div>

		</div>

	);
}

export default Connections;
