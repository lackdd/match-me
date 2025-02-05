
// step 5 of registration
function Step6({DeductStep, AddStep}) {

	return (
		<form className={"step-six"}
			  onSubmit={(e) => {AddStep(e);}}
			  autoComplete={"off"}
		>
			<div className='form-title'>
				<h1>Account created!</h1>
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
					type={'submit'}
					// onClick={AddStep}
				>
					Next
				</button>
				{/*</label>*/}
			</div>
		</form>
	)
}

export default Step6;