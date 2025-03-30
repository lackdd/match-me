import { useState, useEffect } from 'react';

export const useGeolocation = (options = {}) => {
    const [location, setLocation] = useState({
        loaded: false,
        coordinates: { lat: null, lng: null },
        error: null,
    });

    // Success handler for geolocation API
    const onSuccess = (position) => {
        setLocation({
            loaded: true,
            coordinates: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            },
            accuracy: position.coords.accuracy,
            error: null,
        });
    };

    // Error handler for geolocation API
    const onError = (error) => {
        setLocation({
            loaded: true,
            coordinates: { lat: null, lng: null },
            error: {
                code: error.code,
                message: error.message,
            },
        });
    };

    useEffect(() => {
        // Check if browser supports geolocation
        if (!('geolocation' in navigator)) {
            setLocation({
                loaded: true,
                coordinates: { lat: null, lng: null },
                error: {
                    code: 0,
                    message: 'Geolocation not supported',
                },
            });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            onSuccess,
            onError,
            options
        );
    }, [options]);

    return location;
};

export default useGeolocation;
