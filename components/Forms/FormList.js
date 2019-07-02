import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import React, { createElement } from 'react';
export default function FormList({ loadingIndicator, errorDisplay, render }) {
	return (
		<Query
			query={gql`
				query {
					forms {
						_id
						name
						ID
					}
				}
			`}
		>
			{({ loading, error, data }) => {
				if (loading) {
					return createElement(loadingIndicator);
				}
				if (error) {
					return createElement(errorDisplay, { error });
				}

				if (!data.forms.length) {
					return createElement(notFoundDisplay);
				}
				const { forms } = data;
				return createElement(render, { forms });
			}}
		</Query>
	);
}

FormList.defaultProps = {
	loadingIndicator: () => {
		return <p>Loading...</p>;
	},
	errorDisplay: ({ error }) => {
		return <p>Error :( </p>;
	},
	notFoundDisplay: () => {
		return <p>No Forms Found</p>;
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
