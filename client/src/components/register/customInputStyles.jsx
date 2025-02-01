export const customStyles = {
	control: (provided, state) => ({
		...provided,
		// width: '12rem',  // Set custom width
		height: '2rem',  // Set custom height
		minHeight: '2rem',  // ⬅️ This forces the height to apply
		display: 'flex',
		alignItems: 'center',  // Center text and icon vertically
		justifyContent: 'center',
		padding: '0 0',  // Adjust padding for proper spacing
		margin: '0 0',
		borderRadius: state.isFocused ? '10px 10px 0 0' : '10px', // Rounded corners
		borderColor: state.isFocused ? 'rgb(254, 110, 121)' : 'rgb(97, 97, 97)', // Change border on focus
		boxShadow: state.isFocused ? '0 0 5px rgb(254, 110, 121)' : 'none',
		'&:hover': { borderColor: '#rgb(254, 110, 121)' }, // Hover effect
		// boxShadow: 'none', // ⬅️ Ensure no box-shadow on focus
		// '&:hover': { borderColor: 'rgb(254, 110, 121)' },
		// '&:focus': { boxShadow: 'none !important' }, // ⬅️ Force removal on focus

	}),
	menu: (provided) => ({
		...provided,
		width: '12rem',  // Ensuring menu width matches control
		borderRadius: '0 0 10px 10px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '0',
		margin: '0',
	}),
	menuList: (provided) => ({
		...provided,
		padding: '0',  // ⬅️ Remove padding from the menu list
		margin: '0',
	}),
	option: (provided, state) => ({
		...provided,
		backgroundColor: state.isSelected ? 'rgb(254, 110, 121)' : 'white',
		color: state.isSelected ? 'black' : 'black',
		borderRadius: '0',
		padding: '5px 10px',
		cursor: 'pointer',
		alignItems: 'center',
		width: '12rem', // Ensuring menu width matches control
		'&:hover': { backgroundColor: '#E0E0E0' },
		// boxShadow: 'none !important',
	}),
	valueContainer: (provided) => ({
		...provided,
		height: '100%',  // Ensures alignment inside the control
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center', // ⬅️ Ensure center alignment initially
		padding: '0 5px', // ⬅️ Remove any padding that might push text down
		// boxShadow: 'none !important',
	}),
	input: (provided) => ({
		...provided,
		margin: '0px', // Removes unnecessary margin
		padding: '0px', // Ensures proper alignment
		boxShadow: 'none !important', // ⬅️ Remove box-shadow on focus
		// outline: 'none !important', // ⬅️ Remove outline completely
		// '&:focus': { boxShadow: 'none !important', outline: 'none !important' }, // ⬅️ Additional safeguard
	}),
	indicatorsContainer: (provided) => ({
		...provided,
		height: '100%',  // Makes sure indicators align properly
		display: 'flex',
		alignItems: 'center',
		textAlign: 'center',
		// boxShadow: 'none !important',
	}),
	placeholder: (provided) => ({
		...provided,
		height: '100%',  // Makes sure indicators align properly
		display: 'flex',
		alignItems: 'center',
		// boxShadow: 'none !important',
	}),
};