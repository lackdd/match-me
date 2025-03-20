export const dashboardFormStyles = {
	control: (provided, state) => ({
		...provided,
		maxWidth: 'none',
		width: '100%',
		// width: state.selectProps.menuWidth === 'short' ? '8%' : '100%',

	}),
	menu: (provided, state) => ({
		...provided,
		width: '100%',
		minWidth: '100%',
		maxWidth: 'none', // Remove any possible restrictions
		borderRadius: state.selectProps.menuTop ? '10px 10px 0 0' : ' 0 0 10px 10px',
		// width: 'fit-content',  // Ensures the menu fits its contents
		// minWidth: '100%', // Prevents shrinking too much
		// maxWidth: 'none',  // Removes unnecessary width limits
		// overflowX: 'hidden', // Ensures no horizontal scrolling
		// whiteSpace: 'nowrap', // Prevents text wrapping
	}),

	menuList: (provided, state) => ({
		...provided,
		borderRadius: state.selectProps.menuTop ? '10px 10px 0 0' : ' 0 0 10px 10px',
		// maxWidth: 'none',
		// overflowX: 'hidden', // Prevents horizontal scrolling
		// width: state.selectProps.menuWidth === 'short' ? '8%' : '100%',
	}),

	option: (provided, state) => ({
		...provided,
		width: '100%',
		// display: 'block', // Ensure full-width expansion
		// width: state.selectProps.menuWidth === 'short' ? '8%' : '100%',
	}),

	valueContainer: (provided, state) => ({
		...provided,
	}),

	singleValue: (provided) => ({
		...provided,
		width: '100%',
	}),

	input: (provided) => ({
		...provided,
	}),

	indicatorsContainer: (provided) => ({
		...provided,
	}),

	dropdownIndicator: (provided, state) => ({
		...provided,
	}),

	clearIndicator: (provided, state) => ({
		...provided,
	}),

	indicatorSeparator: (provided) => ({
		...provided,
	}),

	placeholder: (provided) => ({
		...provided,
	}),

	// Styling for the selected items (multiValue)
	multiValue: (provided) => ({
		...provided,
	}),

	// Label inside selected items
	multiValueLabel: (provided) => ({
		...provided,
	}),

	// Remove icon in selected items
	multiValueRemove: (provided) => ({
		...provided,
	}),

};
