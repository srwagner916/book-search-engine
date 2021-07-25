const express = require('express');
const { ApolloServer } = require('apollo-server-express');
// uncomment this out
const { typeDefs, resolvers } = require('./schemas');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;


// create apollo server
async function startApolloServer() {
  const server= new ApolloServer({
    typeDefs,
    resolvers
  });
  await server.start();
  //integrate apollo server with express
  server.applyMiddleware({ app });
  
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  
  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }
  
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`)
      console.log(`Use GraphQl at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
}

startApolloServer();
