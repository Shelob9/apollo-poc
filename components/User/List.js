import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import React from "react";
export default function List() {
  return (
    <Query
      query={gql`
        query {
          users {
            _id
            name
          }
        }
      `}
    >
      {({ loading, error, data }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error :(</p>;
        if (!data.users.length) return <p>No Users Found</p>;

        return data.users.map(({ _id, name }) => (
          <div key={_id}>
            <p>{name}</p>
          </div>
        ));
      }}
    </Query>
  );
}
