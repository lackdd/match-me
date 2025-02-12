
// step 4 of registration
import {AdvancedImage} from '@cloudinary/react';
import {getOptimizedImage} from '../utils/cloudinary.jsx';
import {PreviousNextButtons} from './previous-next-buttons.jsx';

function Step4({stepFunctions, image, imageUrl, onImageChange}) {

	return (
		<form className={"step-four"}
			  onSubmit={(e) => {
				  stepFunctions.AddStep(e);
			  e.preventDefault()}}
			  autoComplete={"off"}
			  noValidate
		>
			<div className='form-title'>
				<h1>Choose a profile picture</h1>
			</div>
			{/*todo add ability to move picture, zoom in and out*/}
			<div className={'photo-container'}>
				{imageUrl && <AdvancedImage cldImg={getOptimizedImage(imageUrl)}/>}
				{!image && <img src={"default_profile_picture.png"} alt={"default picture"}/>}
			</div>
			<div className={'submit-picture'}>

				{/*<div className="upload-section">*/}
				{/*	<h3>Upload Profile Picture</h3>*/}

				{/*	/!* Upload Button *!/*/}
				{/*	<input type="file" onChange={onImageChange} accept="image/*"/>*/}

				{/*	/!* Show Image Preview After Upload *!/*/}
				{/*	{imageUrl && (*/}
				{/*		<div className="image-preview">*/}
				{/*			<h4>Preview:</h4>*/}
				{/*			<AdvancedImage cldImg={getOptimizedImage(imageUrl)}/>*/}
				{/*		</div>*/}
				{/*	)}*/}
				{/*</div>*/}

				<label className={"choose-picture"}>
					<input type='file'
						   accept={"image/*"}
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