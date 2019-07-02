import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({
	uri: 'http://localhost:5101/graphql',
});

export const CalderaQLProvider = ({ children }) => (
	<ApolloProvider client={client}>{children}</ApolloProvider>
);
