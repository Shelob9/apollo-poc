import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import React, { createElement } from 'react';
const GET_ENTRY = gql`
	query entry($entryId: ID!) {
		findEntry(entryId: $entryId) {
			_id
			values {
				_id
				value
				field {
					_id
					fieldType
					label
				}
			}
			form {
				_id
			}
		}
	}
`;

export default function SingleEntry({
	entryId,
	loadingIndicator,
	errorDisplay,
	render,
	form,
}) {
	return (
		<Query query={GET_ENTRY} variables={{ entryId }}>
			{({ loading, error, data }) => {
				if (loading) {
					return createElement(loadingIndicator);
				}
				if (error) {
					return createElement(errorDisplay, { error });
				}

				if (!data.findEntry) {
					return createElement(notFoundDisplay);
				}
				const entry = data.findEntry;
				const formId = entry.form._id;
				return createElement(render, { entry, formId, form });
			}}
		</Query>
	);
}

SingleEntry.defaultProps = {
	loadingIndicator: () => {
		return <p>Loading...</p>;
	},
	errorDisplay: ({ error }) => {
		return <p>Error :( </p>;
	},
	notFoundDisplay: () => {
		return <p>No Forms Found</p>;
	},
	render: ({ entry }) => {
		const { _id, values } = entry;
		return (
			<div key={_id}>
				<p>Id: {_id}</p>
				{values && (
					<ul>
						{values.map((value) => (
							<li key={value._id}>{value.value}</li>
						))}
					</ul>
				)}
			</div>
		);
	},
};
