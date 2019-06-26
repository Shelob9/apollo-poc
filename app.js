/**
 * This is the GraphQL server app.
 */

const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, '/dist')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/dist', 'index.html'));
});

const typeDefs = require('./api/Types');
const resolvers = require('./api/Resolvers');

const jwt = require('jsonwebtoken');

const JWT_SECRET = 'makethislongandrandom';

const server = new ApolloServer({
	typeDefs,
	resolvers,
});
server.applyMiddleware({ app });

module.exports = { app };
