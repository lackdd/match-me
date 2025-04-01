import './errorElement.scss';

// error element for forms
export const ErrorElement = ({errors, id}) => {
	return (
		<div className={'error-line'}>
			{errors[id] && <p className='error-text'>{errors[id].message}</p>}
		</div>
	);
};