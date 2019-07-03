import React, { Fragment } from 'react';
import { CalderaForm } from '@calderajs/forms';
import { usePreviewableForm } from './hooks';

export default function Preview({ form, loadingIndicator, onSubmit }) {
	const [theForm] = usePreviewableForm(form);

	if (!theForm.fields || !theForm.rows) {
		return <Fragment>{loadingIndicator}</Fragment>;
	}

	const submitHandler = (values, actions) => {
		onSubmit(values);
		//actions.setSubmitting(false);
	};
	return (
		<CalderaForm
			form={theForm} //form config
			onSubmit={submitHandler}
		/>
	);
}

Preview.defaultProps = {
	loadingIndicator: () => {
		return <div>Loading Form</div>;
	},
};
