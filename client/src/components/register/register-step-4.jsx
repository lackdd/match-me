
// step 4 of registration
function Step4({stepFunctions, image, onImageChange}) {

	return (
		<form className={"step-four"}
			  onSubmit={(e) => {stepFunctions.AddStep(e);}}
			  autoComplete={"off"}
		>
			<div className='form-title'>
				<h1>Choose a profile picture</h1>
			</div>
			<div className={'photo-container'}>
				{image && <img src={image} alt={"preview image"}/>}
				{!image && <img src={"default_profile_picture.png"} alt={"default picture"}/>}
			</div>
			<div className={'submit-picture'}>

				<label className={"choose-picture"}>
					<input type='file'
						   name={'image'}
						   onChange={onImageChange}
						   className='file-upload'/>
					Choose picture
				</label>

			</div>
			<div className={'buttons-container'}>
				<button
					className='previous wide narrow'
					type={'button'}
					onClick={stepFunctions.DeductStep}>
					Previous
				</button>
				<button
					className='next wide narrow'
					type='submit'
				>
					Next
				</button>
			</div>
		</form>
	)
}

export default Step4;