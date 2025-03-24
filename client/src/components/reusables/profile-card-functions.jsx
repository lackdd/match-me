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

export const openChangePicture = (event) => {
	const picturePopup = document.getElementById('picture-popup')
	picturePopup.style.display = 'flex';
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
			await sendPictureToBackend(uploadedUrl, tokenValue);
			/*setImageUrl(uploadedUrl); // store the uploaded image url
			console.log("Cloudinary image url:", uploadedUrl);*/
		} else {
			console.log("Failed to upload image.");
		}
	}
	setLoadingImage(false);
};

export const sendPictureToBackend = async(uploadedUrl, tokenValue) => {
	const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

	try {
		const response = await axios.patch(`${VITE_BACKEND_URL}/api/me`,
			{profilePicture: uploadedUrl},{
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