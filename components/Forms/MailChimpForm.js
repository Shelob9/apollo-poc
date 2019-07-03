import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import React from 'react';

export default function MailChimpForm({ listId }) {
	return (
		<Query
			query={gql`
				query {
					listCategories(listId: "45907f0c59") {
						_id
						categoryId
						type
						title
						displayOrder
					}
					listInterests(listId: "45907f0c59") {
						_id
						categoryId
						name
						displayOrder
					}
					listFields(listId: "45907f0c59") {
						name
						_id
						listId
						displayOrder
						type
					}
				}
			`}
		>
			{({ loading, error, data }) => {
				if (loading) return <p>Loading...</p>;
				if (error) return <p>Error :(</p>;
				const { listFields, listCategories, listInterests } = data;
				const form = {};
				return <div>Forms</div>;
			}}
		</Query>
	);
}
