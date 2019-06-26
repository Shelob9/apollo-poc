import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import React, { useEffect } from "react";

const ADD_USER = gql`
  mutation AddUser($name: String!) {
    createUser(name: $name) {
      _id
      name
    }
  }
`;

export default function Create(){
  let input;

  return (
    <Mutation mutation={ADD_USER}>
      {(createUser, { data }) => (
        <div>
          <form
            onSubmit={e => {
              e.preventDefault();
              createUser({ variables: { name: input.value } });
              input.value = "";
            }}
          >
            <label>User Name</label>
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
};
