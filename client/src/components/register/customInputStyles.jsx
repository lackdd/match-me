export const customStyles = {
	control: (provided, state) => ({
		...provided,
		fontSize: '0.875rem',
		minHeight: '2rem',  // Ensure it starts with a height of 2rem
		height: 'auto',  // Set to 'auto' so it adjusts based on content
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
		padding: '0 0',
		margin: '0 0',
		boxSizing: 'border-box',
		backgroundColor: state.selectProps.isValid
			? '#d4f5d9' // light green if isValid is true
			: state.selectProps.isError
				? '#ffbebe' // light red if isError is true
				: 'white', // default to white
		borderRadius:
			state.isFocused && state.selectProps.menuIsOpen
				? (state.selectProps.menuTop ? '0 0 10px 10px' : '10px 10px 0 0'): '10px' ,
		borderColor: state.isFocused ? 'rgb(254, 110, 121)' : 'rgb(97, 97, 97)',
		boxShadow: state.isFocused ? '0 0 5px rgb(254, 110, 121)' : 'none',
		'&:hover': { borderColor: '#rgb(254, 110, 121)' },

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
		boxSizing: 'border-box',
		border: '1px solid rgba(97, 97, 97, 0.5)',
		boxShadow: 'none'
	}),

	menuList: (provided) => ({
		...provided,
		padding: '0',
		margin: '0',
		maxHeight: '11rem',
	}),

	option: (provided, state) => ({
		...provided,
		tabIndex: 0,  // Ensures the option is focusable
		backgroundColor: state.isFocused
			? '#D1D1D1'
			: state.isSelected
				? '#E0E0E0'  // Highlight on focus
				: 'white',
		color: state.isSelected ? 'black' : 'black',
		borderRadius: '0',
		padding: '5px 10px',
		cursor: 'pointer',
		alignItems: 'center',
		width: state.selectProps.wideMenu === true ? '25.25rem' : '12rem', // Ensuring menu width matches control
		'&:active': {
			backgroundColor: 'rgb(254, 110, 121)',
		},
	}),

	valueContainer: (provided, state) => ({
		...provided,
		minHeight: '2rem',  // Ensure it starts with a height of 2rem
		height: state.selectProps.containerExpand === true ? 'auto' : '2rem',  // Ensures alignment inside the control
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
		padding: '0 5px',
		margin: '0',
		boxSizing: 'border-box',
		flexWrap: 'wrap', // Prevent the container from wrapping the items
		overflow: 'hidden',  // Ensure it doesn't overflow
		lineHeight: '2rem',
	}),

	singleValue: (provided) => ({
		...provided,
	}),

	input: (provided) => ({
		...provided,
		minHeight: '2rem',
		height: 'auto',
		margin: '0',
		padding: '0',
		lineHeight: '2rem',
		boxShadow: 'none !important',
		boxSizing: 'border-box !important',

	}),

	indicatorsContainer: (provided) => ({
		...provided,
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		textAlign: 'center',
		paddingLeft: '8px',
		// boxShadow: 'none !important',
	}),

	dropdownIndicator: (provided, state) => {
		const isReversed = state.selectProps.menuTop; // Assuming menuTop is passed as a prop to the select

		return {
			...provided,
			color: state.isFocused ? 'rgb(97, 97, 97)' : 'rgb(97, 97, 97)', // green when focused, grey otherwise
			transform:
				isReversed
					? state.selectProps.menuIsOpen
						? 'rotate(0deg)' // Arrow points down when menu is open
						: 'rotate(180deg)' // Arrow points up when menu is closed
					: state.selectProps.menuIsOpen
						? 'rotate(180deg)' // Arrow points up when menu is open
						: 'rotate(0deg)', // Arrow points down when menu is closed
			transition: 'transform 0.2s ease-in-out', // Smooth animation
			':hover': {
				color: 'rgb(21,21,21)',
			},
		};
	},

	clearIndicator: (provided, state) => ({
		...provided,
		color: state.isFocused ? 'rgb(97, 97, 97)' : 'rgb(97, 97, 97)', // green when focused, grey otherwise
		':hover': {
			color: 'rgb(21,21,21)',
		},
	}),

	indicatorSeparator: (provided) => ({
		...provided,
		backgroundColor: '#888', // grey separator
	}),

	placeholder: (provided) => ({
		...provided,
		height: '100%',
		width: '100%',
		display: 'flex',
		alignItems: 'center',
		textAlign: 'left',
	}),

	// Styling for the selected items (multiValue)
	multiValue: (provided) => ({
		...provided,
		borderRadius: '8px',
		backgroundColor: 'rgb(254, 110, 121)',
		flexWrap: 'nowrap', // Wrap multi-selected items to new rows
		display: 'inline-flex', // Allows values to shrink and grow
		lineHeight: '100%',
	}),

	// Label inside selected items
	multiValueLabel: (provided) => ({
		...provided,
		color: 'black',
		textAlign: 'left',
		whiteSpace: 'nowrap',  // Prevent wrapping
		overflow: 'hidden',  // Prevent overflow from expanding the container
		textOverflow: 'clip',  // Add ellipsis when the text overflows when is it being removed (animated)
	}),

	// Remove icon in selected items
	multiValueRemove: (provided) => ({
		...provided,
		color: 'black',
		cursor: 'pointer',
		borderRadius: '8px',
	}),

};