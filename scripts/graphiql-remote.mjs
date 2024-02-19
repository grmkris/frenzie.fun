import { serveEncodedDefinition } from "@composedb/devtools-node";

/**
 * Runs GraphiQL server to view & query composites.
 */
const server = await serveEncodedDefinition({
  ceramicURL: 'https://ceramic-production.up.railway.app',
  graphiql: true,
  path: "./src/__generated__/definition.json",
  port: 5001,
});

console.log(`Server started on http://localhost:${server.port}`);

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Server stopped");
  });
});
