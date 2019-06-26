import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import React, { useEffect } from "react";

const ADD_ACCOUNT = gql`
  mutation AddAccount($apiKey: String!) {
    addAccount(apiKey: $apiKey) {
      _id
    }
  }
`;

export default function Create() {
  let input;

  return (
    <Mutation mutation={ADD_ACCOUNT}>
      {(addAccount, { data }) => (
        <div>
          <form
            onSubmit={e => {
              e.preventDefault();
              addAccount({ variables: { apiKey: input.value } });
              input.value = "";
            }}
          >
            <label>Api Key</label>
            <input
              ref={node => {
                input = node;
              }}
            />
            <button type="submit">Create</button>
          </form>
        </div>
      )}
    </Mutation>
  );
}
