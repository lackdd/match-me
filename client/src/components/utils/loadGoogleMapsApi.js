const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;

const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&loading=async&libraries=places&language=en`;
script.async = true;
script.defer = true;

// Add the script to the document head
document.head.appendChild(script);

script.onload = () => {
	console.log("Google Maps API loaded");
	// Initialize your map or other Google Maps features here
	// initMap();
};