/* eslint-disable no-console */
const Hapi = require('@hapi/hapi');
const routes = require('./routes');

// Set the server configuration
const config = {
  port: 9000,
  host: 'localhost',
};

// Create an async function
// to initialize the server
const init = async (c) => {
  // Create a new server with
  // the provided configuration
  const server = Hapi.server({
    port: c.port,
    host: c.host,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // Add the routes to the server
  server.route(routes);

  // Start the server and log its URI
  await server.start();
  console.log(`Running at: ${server.info.uri}`);

  // Return the server object
  return server;
};

// Call the init function
// with the config object
init(config);
