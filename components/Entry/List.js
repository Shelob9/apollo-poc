import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import React, { createElement } from 'react';

const GET_ALL_ENTRIES_FOR_FORM = gql`
	query GET_ALL_FOR_FORM($formId: ID!) {
		entries(formId: $formId) {
			values {
				_id
				entry {
					_id
				}
				value
				entry {
					_id
				}
				field {
					_id
				}
			}
		}
	}
`;

export default function List({
	loadingIndicator,
	errorDisplay,
	notFoundDisplay,
	render,
	form,
	formId,
}) {
	return (
		<Query query={GET_ALL_ENTRIES_FOR_FORM} variables={{ formId }}>
			{({ loading, error, data }) => {
				if (loading) {
					return createElement(loadingIndicator);
				}
				if (error) {
					return createElement(errorDisplay, { error });
				}
				if (!data.entries.length) {
					return createElement(notFoundDisplay, {});
				}
				const entries = data.entries.map((entry) => {
					let entryValues = {};

					entry.values.forEach((value) => {
						const fieldId = value.field._id;
						const entryId = value.entry._id;
						const entryValueId = value._id;
						entryValues[entryValueId] = {
							fieldId,
							formId,
							slug: fieldId,
							entryId,
							id: entryValueId,
							value: value.value,
						};
					});

					return { ...entry, entryValues };
				});

				return createElement(render, { entries, form });

				/**
                if (!data.findEntry) {
					return createElement(notFoundDisplay);
				} 
                 */

				return <div>Entry Viewer</div>;
			}}
		</Query>
	);
}

List.defaultProps = {
	loadingIndicator: () => {
		return <p>Loading...</p>;
	},
	errorDisplay: ({ error }) => {
		return <p>Error :( </p>;
	},
	notFoundDisplay: () => {
		return <p>No Entries Found</p>;
	},
	render: ({ forms }) => {
		return forms.map(({ _id, name, ID }) => (
			<div key={_id}>
				<p>Id: {_id}</p>
				<p>Name: {name}</p>
				<p>Form ID: {ID}</p>
			</div>
		));
	},
};
