// helped function to format match data
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

// close settings popup
export const closeSettings = (event) => {
	const settingsPopup = document.getElementById('settings-popup')
	settingsPopup.style.display = 'none';
}