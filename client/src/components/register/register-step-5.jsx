
// step 5 of registration
function Step5({DeductStep, AddStep, Submit}) {

	return (
		<form className={"step-five"}
			  onSubmit={(e) => {AddStep(e);}}
			  autoComplete={"on"}
		>
			<div className='form-title'>
				<h1>Who are you looking for?</h1>
			</div>
			<div className={'buttons-container'}>
				{/*<label>*/}
				<button
					className='previous wide narrow'
					type={'button'}
					onClick={DeductStep}>
					Previous
				</button>
				{/*</label>*/}
				{/*<label>*/}
				<button
					className='next wide narrow'
					type='submit'
					onClick={Submit}
					// onClick={AddStep}
				>
					Register
				</button>
				{/*</label>*/}
			</div>
		</form>
	)
}

export default Step5;