import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import React from "react";
export default function List() {
  return (
    <Query
      query={gql`
        query {
          accounts {
            _id
            name
            apiKey
          }
        }
      `}
    >
      {({ loading, error, data }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error :(</p>;
        if (!data.accounts.length) return <p>No Accounts Found</p>;
        return data.accounts.map(({ _id, name, apiKey }) => (
          <div key={_id}>
            <p>Id: {_id}</p>
            <p>Name: {name}</p>
            <p>Api Key: {apiKey}</p>
          </div>
        ));
      }}
    </Query>
  );
}
