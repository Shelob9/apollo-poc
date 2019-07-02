# Good Apollo IV: Volume 2

Words

## Usage

* Start GraphQl erver and UI client for development
  * `yarn dev`
* Start WordPress site and block watcher
  * `yarn dev:wp`
* Develop UI Client
  * `yarn start:client`
* Build UI Client for production
  * `yarn build:app`
* Start GraphQL server
  * `yarn start:server`
* Start WordPress
  * `docker-compose up -d`
* Develop Blocks
  * `yarn start:block`
* Build blocks for production
  * `yarn build:blocks`

## Overivew

### Client

The UI uses Next.js as its framework and [Apollo React client] to connect to Grahql Server.

* Provides components to query forms, form entry data and email marketting lists.
* All components use render props for rendering.
* Right now also has UI elements to make things simpler, but this package's responsiblity is to provide state, not to render state.

### Server

* `/api`
  * Server:
    * `/api/types`
    * `/api/resolvers`
* `/app.js`
  * Express app
* `/server.js`
  * HTTP(S) server

* [Apollo  Server](https://www.apollographql.com/docs/apollo-server/)
* Provides GraphQL types and database storage
  * [Mongoose](https://mongoosejs.com/docs/api/model.html) is used as ORM
  * [MongoDB](https://www.mongodb.com/) is used as the database.
* Server-side rendering for client
  
### WordPress

A WordPress site is included for showing how customer sites can use blocks to interact with this app. Also, development of those blocks.

## URLs

* Application UI
  * http://localhost:3000/
* WordPress
  * http://localhost:5100/
* GraphQL Server
  * http://localhost:5101/graphql
  