import {useState} from 'react';

// custom hook for geolocation detection
export const useGeolocation = (options = {}) => {
	const [location, setLocation] = useState({
		loaded: false,
		coordinates: {lat: null, lng: null},
		error: null
	});

	// Function to request location
	const requestLocation = () => {
		if (!('geolocation' in navigator)) {
			setLocation({
				loaded: true,
				coordinates: {lat: null, lng: null},
				error: {
					code: 0,
					message: 'Geolocation not supported'
				}
			});
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				setLocation({
					loaded: true,
					coordinates: {
						lat: position.coords.latitude,
						lng: position.coords.longitude
					},
					accuracy: position.coords.accuracy,
					error: null
				});
			},
			(error) => {
				setLocation({
					loaded: true,
					coordinates: {lat: null, lng: null},
					error: {
						code: error.code,
						message: error.message
					}
				});
			},
			options
		);
	};

	return {location, requestLocation};
};

export default useGeolocation;