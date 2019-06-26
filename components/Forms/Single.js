import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import React, { createElement } from 'react';

const GET_FORM = gql`
	query GET_THE_FORM($formId: String!) {
		getForm(ID: $formId) {
			_id
			name
			ID
			fields {
				_id
				fieldType
				label
			}
			conditionals {
				_id
				name
				group {
					_id
				}
				form {
					fields {
						_id
						fieldType
						label
					}
				}
			}
			processors {
				_id
				type
				typeLabel
				label
			}
		}
	}
`;

export default function Single({
	formId,
	loadingIndicator,
	errorDisplay,
	render,
}) {
	return (
		<Query query={GET_FORM} variables={{ formId }}>
			{({ loading, error, data }) => {
				if (loading) {
					return createElement(loadingIndicator);
				}
				if (error) {
					return createElement(errorDisplay, { error });
				}

				if (!data.getForm) {
					return createElement(notFoundDisplay);
				}
				const form = data.getForm;
				return createElement(render, { form });
			}}
		</Query>
	);
}

Single.defaultProps = {
	loadingIndicator: () => {
		return <p>Loading...</p>;
	},
	errorDisplay: ({ error }) => {
		return <p>Error :( </p>;
	},
	notFoundDisplay: () => {
		return <p>No Forms Found</p>;
	},
	render: ({ form }) => {
		const { _id, name, ID } = form;
		return (
			<div key={_id}>
				<p>Id: {_id}</p>
				<p>Name: {name}</p>
				<p>Form ID: {ID}</p>
			</div>
		);
	},
};
