import React, { Fragment, useContext, useEffect, useState } from 'react';
import FormList from './Forms/FormList';
import { SelectField } from '@calderajs/components';
export const SimpleFormChooser = ({ formId, onChange }) => {
	return (
		<FormList
			render={(forms) => {
				if (forms.hasOwnProperty('forms')) {
					forms = forms.forms;
				}
				return (
					<SelectField
						fieldId="choose--"
						value={formId}
						label={'Choose Form'}
						onChange={onChange}
						options={forms.map((form) => {
							return {
								value: form._id,
								label: form.name,
							};
						})}
					/>
				);
			}}
		/>
	);
};
