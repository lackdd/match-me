// helped function to format match data
import {uploadToCloudinary} from '../utils/cloudinary.jsx';
import axios from 'axios';
import {useAuth} from '../utils/AuthContext.jsx';

export const formatData = (data) => {
	for (let i = 0; i < data.length; i++) {
		data[i] = data[i].replaceAll("_", " ")

		if (i < data.length - 1) {
			data[i] = data[i] + ", "
		}

		// console.log(data[i]);
	}
	return data;
}

// helped function to format location data (remove "County")
export const formatLocation = (data) => {
	return data.replaceAll(" County", "")
}

// open settings popup
export const openSettings = (event) => {
	const settingsPopup = document.getElementById('settings-popup')
	settingsPopup.style.display = 'flex';
}

export const changeImage = async (event, setMyDataFormatted, setImage, tokenValue, setLoadingImage) => {
	if (event.target.files && event.target.files[0]) {
		// const imageUrl = (URL.createObjectURL(event.target.files[0])); // show local preview before upload
		setLoadingImage(true);
		// upload to cloudinary
		const uploadedUrl = await uploadToCloudinary(event.target.files[0]);
		if (uploadedUrl) {
			const publicId = uploadedUrl.split('/').pop().split('.')[0]; // Extract only the public ID
			setMyDataFormatted((prev) => ({
			...prev,
					profilePicture: uploadedUrl,
			}));
			console.log("Cloudinary image public ID:", publicId);
			setImage(uploadedUrl)
			await sendPictureToBackend(publicId, tokenValue);
			/*setImageUrl(uploadedUrl); // store the uploaded image url
			console.log("Cloudinary image url:", uploadedUrl);*/
		} else {
			console.log("Failed to upload image.");
		}
	}
	setLoadingImage(false);
};

export const sendPictureToBackend = async(publicId, tokenValue) => {
	const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

	try {
		const response = await axios.patch(`${VITE_BACKEND_URL}/api/me`,
			{profilePicture: publicId},{
			headers: {
				Authorization: `Bearer ${tokenValue}`,
				'Content-Type': 'application/json'}
			}
		)
		console.log("Profile picture updated successfully");
		return response.data
	} catch (error) {
		if (error.response) {
			console.error("Backend error:", error.response.data); // Server responded with an error
		} else {
			console.error("Request failed:", error.message); // Network error or request issue
		}
	}
}

// close settings popup
export const closeSettings = (event) => {
	const settingsPopup = document.getElementById('settings-popup')
	settingsPopup.style.display = 'none';
}

export const backToObject = (array, options) => {
	const formattedArray = array.map(item => item.replaceAll(',', '').trim());
	const arrayOfObjects = formattedArray.map(item => options.find(option => option.value === item)).filter(Boolean);
	return arrayOfObjects;
}

// export const formatDataForView = (data, isDataFormatted) => {
// 	if (data !== null && data && isDataFormatted === false) {
// 		const updatedProfile = {
// 			...data,
// 			location: formatLocation(data.location),
// 			// location: myDataFormatted.location,
// 			preferredMusicGenres: Array.isArray(data.preferredMusicGenres)
// 				? formatData(data.preferredMusicGenres)
// 				: data.preferredMusicGenres,
// 			preferredMethod: Array.isArray(data.preferredMethod)
// 				? formatData(data.preferredMethod)
// 				: data.preferredMethod,
// 			additionalInterests: Array.isArray(data.additionalInterests)
// 				? formatData(data.additionalInterests)
// 				: data.additionalInterests,
// 			personalityTraits: Array.isArray(data.personalityTraits)
// 				? formatData(data.personalityTraits)
// 				: data.personalityTraits,
// 			goalsWithMusic: Array.isArray(data.goalsWithMusic)
// 				? formatData(data.goalsWithMusic)
// 				: data.goalsWithMusic
// 		};
// 		return updatedProfile;
//
// 		// Check if the profile data has changed before updating the state
// 		// if (JSON.stringify(updatedProfile) !== JSON.stringify(data)) {
// 		// 	setMyDataFormatted((prev) => ({
// 		// 		...prev,
// 		// 		...updatedProfile
// 		// 	}));
// 		// 	isDataFormatted.current = true;
// 		// }
// 	}
// 	return data;
// }