
// step 4 of registration
import {useState} from 'react';

function Step4({DeductStep, AddStep,
			   onImageChange,
			   image, setImage}) {

	return (
		<form className={"step-four"}
			  onSubmit={(e) => {AddStep(e);}}
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
				{/*<button>*/}
				<label className={"choose-picture"}>
					<input type='file' onChange={onImageChange} className='file-upload'/>
					Choose picture
				</label>

				{/*Choose picture*/}
				{/*</button>*/}
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
					// onClick={AddStep}
				>
					Next
				</button>
				{/*</label>*/}
			</div>
		</form>
	)
}

export default Step4;