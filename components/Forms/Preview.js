import React, { useState, useEffect, Fragment } from 'react';
import { CalderaForm } from '@calderajs/forms';

export default function Preview({ form, loadingIndicator, onSubmit }) {
	const [theForm, updateTheForm] = useState(form);
	/**
	 * Prepare form for preview
	 */
	useEffect(() => {
		//Make sure fieldId is set as @calderajs/forms wants it to be
		const fields = form.fields.map((field) => {
			const fieldId = field.hasOwnProperty('fieldId')
				? field.fieldId
				: field._id;
			return {
				...field,
				fieldId,
			};
		});

		//If rows are not provided, add one row per field
		let rows = !form.hasOwnProperty('rows')
			? (rows = fields.map((field) => {
					const { fieldId } = field;
					return {
						rowId: `r-${fieldId}`,
						columns: [
							{
								fields: [fieldId],
								width: '12',
								columnId: `c-${fieldId}`,
							},
						],
					};
			  }))
			: form.rows;

		//Update the form so it has rows and fields
		updateTheForm({
			...theForm,
			fields,
			rows,
		});
	}, [form, updateTheForm]);

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
