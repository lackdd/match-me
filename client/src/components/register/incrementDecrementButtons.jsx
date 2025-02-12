import {IoIosArrowDown, IoIosArrowUp} from 'react-icons/io';

export function IncrementDecrementButtons({id, watch, setValue, trigger}) {
	return (
		<div
			className={'number-buttons'}
			onClick={(e) => {
				e.preventDefault()
				trigger(id)
			}}
		>
			<button
				type={'button'}
				tabIndex={-1}
				className={'number-field increment'}
				onMouseDown={(e) => e.preventDefault()} // Prevents losing focus and triggering validation
				onClick={(e) => {
					if (document.activeElement.id !== id) {
						document.getElementById(id).focus();
					}
					if (!watch(id)) {
						setValue(id, 1);
					} else {
						setValue(id, parseInt(watch(id)) + 1);
					}
					console.log(watch(id));
				}}>
				<IoIosArrowUp/>
			</button>
			<button
				type={'button'}
				tabIndex={-1}
				className={'number-field decrement'}
				onMouseDown={(e) => e.preventDefault()} // Prevents losing focus and triggering validation
				onClick={(e) => {
					if (document.activeElement.id !== id) {
						document.getElementById(id).focus();
					}
					if (!watch(id)) {
						setValue(id, 1);
					} else {
						setValue(id, parseInt(watch(id)) - 1);
					}
					console.log(watch(id));
				}}>
				<IoIosArrowDown/>
			</button>
		</div>
	)
}