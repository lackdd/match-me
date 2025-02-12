export const PreviousNextButtons = ({DeductStep, text = "Next", errors = {} }) => {
	return (
		<div className={'buttons-container'}>
			<button
				className='previous wide narrow'
				type={'button'}
				onClick={DeductStep}>
				Previous
			</button>
			<button
				className={`next wide narrow ${Object.keys(errors).length > 0 ? "disabled" : ""}`}
				type={'submit'}
			>
				{text}
			</button>
		</div>
	)
}