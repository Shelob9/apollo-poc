import React, { Fragment, useContext, useEffect, useState } from 'react';
import { FormList } from './Forms';
import { SelectField } from '@calderajs/components';
export const SimpleFormChooser = ({ formId, onChange }) => {
	return (
		<FormList
			render={(forms) => {
				console.log(forms);
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
