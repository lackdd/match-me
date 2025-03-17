const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY; // Read from .env
const googleApi = import.meta.env.VITE_GOOGLE_API; // Read from.env

export function loadGoogleMapsScript() {
	return new Promise((resolve, reject) => {
		if (window.google?.maps?.places) {
			resolve();
			return;
		}

		const existingScript = document.getElementById("google-maps-script");
		if (existingScript) {
			existingScript.onload = () => resolve();
			existingScript.onerror = reject;
			return;
		}

		const script = document.createElement("script");
		script.id = "google-maps-script";
		script.src = googleApi;
		script.async = true;
		script.defer = true;
		script.onload = resolve;
		script.onerror = reject;
		document.body.appendChild(script);
	});
}