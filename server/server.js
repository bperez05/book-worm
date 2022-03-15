const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const path = require('path');
const db = require('./config/connection');
// const routes = require('./routes');
const server = new ApolloServer({
  typeDefs,
  resolvers
});
const app = express();
const PORT = process.env.PORT || 80;



app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  console.log('In Production');
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.use(routes); //take this out later

server.start().then(res => {
  server.applyMiddleware({ app })//Add apollo-server to mididleware
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});