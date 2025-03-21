// helped function to format match data
import {uploadToCloudinary} from '../utils/cloudinary.jsx';

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

export const changeImage = async (event, setMyDataFormatted, setImage) => {
	if (event.target.files && event.target.files[0]) {
		setImage(URL.createObjectURL(event.target.files[0])); // show local preview before upload

		// upload to cloudinary
		const uploadedUrl = await uploadToCloudinary(event.target.files[0]);
		if (uploadedUrl) {
			const publicId = uploadedUrl.split('/').pop().split('.')[0]; // Extract only the public ID
			setMyDataFormatted((prev) => ({
			...prev,
					linkToImage: publicId,
			}));
			console.log("Cloudinary image public ID:", publicId);
			/*setImageUrl(uploadedUrl); // store the uploaded image url
			console.log("Cloudinary image url:", uploadedUrl);*/
		} else {
			console.log("Failed to upload image.");
		}
	}
};

// close settings popup
export const closeSettings = (event) => {
	const settingsPopup = document.getElementById('settings-popup')
	settingsPopup.style.display = 'none';
}