export const customStyles = {
	control: (provided, state) => ({
		...provided,
		// width: '12rem',  // Set custom width'
		fontSize: '0.875rem', // Set custom font size
		minHeight: '2rem',  // Ensure it starts with a height of 2rem
		height: 'auto',  // Set to 'auto' so it adjusts based on content
		display: 'flex',
		alignItems: 'center',  // Center text and icon vertically
		justifyContent: 'flex-start',
		padding: '0 0',  // Adjust padding for proper spacing
		margin: '0 0',
		boxSizing: 'border-box', // Make sure border is inside
		borderRadius: state.isFocused ? '10px 10px 0 0' : '10px', // Rounded corners
		borderColor: state.isFocused ? 'rgb(254, 110, 121)' : 'rgb(97, 97, 97)', // Change border on focus
		boxShadow: state.isFocused ? '0 0 5px rgb(254, 110, 121)' : 'none',
		'&:hover': { borderColor: '#rgb(254, 110, 121)' }, // Hover effect
		// boxShadow: 'none', // ⬅️ Ensure no box-shadow on focus
		// '&:hover': { borderColor: 'rgb(254, 110, 121)' },
		// '&:focus': { boxShadow: 'none !important' }, // ⬅️ Force removal on focus
		// position: 'relative',  // Ensure control stays in place
		// zIndex: 1,  // Ensure it's properly stacked

	}),
	menu: (provided, state) => ({
		...provided,
		width: state.selectProps.wideMenu === true ? '25.25rem' : '12rem',
		borderRadius: '0 0 10px 10px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '0',
		margin: '0',
		opacity: '0.95',
		boxSizing: 'border-box', // Ensure border is included within the width
		border: '1px solid rgba(97, 97, 97, 0.5)', // Add border inside
		boxShadow: 'none'
	}),
	menuList: (provided) => ({
		...provided,
		padding: '0',  // ⬅️ Remove padding from the menu list
		margin: '0',
		maxHeight: '13rem',
	}),
	option: (provided, state) => ({
		...provided,
		backgroundColor: state.isSelected ? 'rgb(254, 110, 121)' : 'white',
		color: state.isSelected ? 'black' : 'black',
		borderRadius: '0',
		padding: '5px 10px',
		cursor: 'pointer',
		alignItems: 'center',
		width: state.selectProps.wideMenu === true ? '25.25rem' : '12rem', // Ensuring menu width matches control
		'&:hover': { backgroundColor: '#E0E0E0' },
		// boxShadow: 'none !important',
	}),
	valueContainer: (provided, state) => ({
		...provided,
		minHeight: '2rem',  // Ensure it starts with a height of 2rem
		height: state.selectProps.containerExpand === true ? 'auto' : '2rem',  // Ensures alignment inside the control
		display: 'flex',
		// flexWrap: 'wrap',  // Enable wrapping of content
		alignItems: 'center',  // Align items to the top
		justifyContent: 'flex-start', // ⬅️ Ensure center alignment initially
		padding: '0 5px', // ⬅️ Remove any padding that might push text down
		margin: '0',
		boxSizing: 'border-box', // Ensure border is included within the width
		// boxShadow: 'none !important',
		flexWrap: 'wrap', // Prevent the container from wrapping the items
		overflow: 'hidden',  // Ensure it doesn't overflow
		lineHeight: '2rem',
	}),
	singleValue: (provided) => ({
		...provided,
		// borderRadius: '8px', // Change border radius for selected items
		// backgroundColor: 'rgb(254, 110, 121)', // Example background color for selected items
		// display: 'flex',
		// alignItems: 'center',  // Ensure the items are centered vertically
		// paddingLeft: '8px',    // Optional: Adjust padding for left alignment
	}),
	input: (provided) => ({
		...provided,
		minHeight: '2rem',  // Ensure it starts with a height of 2rem
		height: 'auto',  // Set to 'auto' so it adjusts based on content
		margin: '0', // Removes unnecessary margin
		padding: '0', // Ensures proper alignment
		lineHeight: '2rem',  // Set line-height to match control height, helps with centering
		boxShadow: 'none !important', // ⬅️ Remove box-shadow on focus
		boxSizing: 'border-box !important', // Ensure border is included within the width
		// display: 'flex',  // Make input container a flex container
		// alignItems: 'center',  // Center text vertically
		// outline: 'none !important', // ⬅️ Remove outline completely
		// '&:focus': { boxShadow: 'none !important', outline: 'none !important' }, // ⬅️ Additional safeguard
	}),
	indicatorsContainer: (provided) => ({
		...provided,
		height: '100%',  // Makes sure indicators align properly
		display: 'flex',
		alignItems: 'center',
		textAlign: 'center',
		paddingLeft: '8px',
		// boxShadow: 'none !important',
	}),
	placeholder: (provided) => ({
		...provided,
		height: '100%',  // Makes sure indicators align properly
		width: '100%',
		display: 'flex',
		alignItems: 'center',
		textAlign: 'left',
		// boxShadow: 'none !important',
	}),
	// Styling for the selected items (multiValue)
	multiValue: (provided) => ({
		...provided,
		borderRadius: '8px', // Change border radius for selected items
		backgroundColor: 'rgb(254, 110, 121)', // Example background color for selected items
		flexWrap: 'nowrap', // Wrap multi-selected items to new rows
		display: 'inline-flex', // Allows values to shrink and grow
		lineHeight: '100%', //
		// display: 'flex',
		// alignItems: 'center',  // Ensure the items are centered vertically
		// paddingLeft: '8px',    // Optional: Adjust padding for left alignment
	}),
	// Label inside selected items
	multiValueLabel: (provided) => ({
		...provided,
		color: 'black', // Change text color inside the selected item
		textAlign: 'left',  // Align text to the left
		whiteSpace: 'nowrap',  // Prevent wrapping
		overflow: 'hidden',  // Prevent overflow from expanding the container
		textOverflow: 'clip',  // Add ellipsis when the text overflows
		// paddingLeft: '8px',
		// display: 'inline-block', // Ensure label is inline-block
	}),
	// Remove icon in selected items
	multiValueRemove: (provided) => ({
		...provided,
		color: 'black', // Change remove icon color
		cursor: 'pointer',
		borderRadius: '8px', // Change border radius for selected items
	}),

};