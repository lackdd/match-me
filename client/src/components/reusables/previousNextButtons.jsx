export const PreviousNextButtons = ({DeductStep, text = "Next", errors = {}, isValid = {} }, ) => {
	return (
		<div className={'register-buttons-container'}>
			<button
				className='previous wide narrow'
				type={'button'}
				onClick={DeductStep}>
				Previous
			</button>
			<button
				// className={`next wide narrow ${Object.keys(errors).length > 0 ? "disabled" : ""}`}
				type={'submit'}
				// disabled={Object.keys(errors).length > 0}
				className={`next wide narrow ${!isValid ? 'disabled' : ''}`} // Disabled by default
				disabled={!isValid} // Only enabled when the form is valid
			>
				{text}
			</button>
		</div>
	)
}