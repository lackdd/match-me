
// step 5 of registration
function Step6({DeductStep, AddStep}) {



	return (
		<form className={"step-six"}
			  onSubmit={(e) => {AddStep(e);}}
			  autoComplete={"off"}
		>
			<div className='form-title'>
				<h1>Account created!</h1>
				<p>cool animation for 3-5 seconds -> give token -> redirect to /dashboard </p>
			</div>
			<div className={'buttons-container'}>
				<button
					className='previous wide narrow'
					type={'button'}
					onClick={DeductStep}>
					Previous
				</button>
				<button
					className='next wide narrow'
					type={'submit'}
				>
					Next
				</button>
			</div>
		</form>
	)
}

export default Step6;