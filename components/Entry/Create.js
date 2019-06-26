import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import React, { createElement } from 'react';
import * as Forms from '../Forms';
const SUBMIT_FORM = gql`
	mutation SubmitForm($formId: String!, $entryValues: [EntryValueInput]) {
		newEntry(formId: $formId, entryValues: $entryValues) {
			_id
			form {
				_id
			}
		}
	}
`;

export default function Create({ render, formId, success, form }) {
	return (
		<Mutation mutation={SUBMIT_FORM}>
			{(newEntry, { data, called }) => {
				const onSubmit = (values) => {
					const entryValues = Object.keys(values)
						.map((fieldId) => {
							const value =
								values.hasOwnProperty(fieldId) &&
								'object' !== typeof values[fieldId]
									? values[fieldId]
									: null;
							if (value) {
								return {
									fieldId,
									value,
								};
							}
						})
						.filter((field) => field);
					newEntry({ variables: { formId, entryValues } });
				};
				if (
					'object' === typeof data &&
					data.hasOwnProperty('newEntry')
				) {
					const entry = data.newEntry;
					const formId = entry.form._id;
					const entryId = entry._id;

					return createElement(success, {
						entry,
						form,
						entryId,
					});
				}

				if (render) {
					return createElement(render, { onSubmit });
				}
			}}
		</Mutation>
	);
}

Create.defaultProps = {
	success: ({ entryId }) => {
		return <div>New Entry Created {entryId} </div>;
	},
};
