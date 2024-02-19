import { writeComposite } from './composites-remote.mjs';
import ora from "ora";
import {spawn} from "child_process";

const spinner = ora();

export const graphiql = async () => {
  spinner.info("[GraphiQL] starting graphiql");
  const graphiql = spawn('node', ['./scripts/graphiql-remote.mjs'])
  spinner.succeed("[GraphiQL] graphiql started");
  graphiql.stdout.on('data', (buffer) => {
    console.log('[GraphiqQL]',buffer.toString())
  })
}


const start = async () => {
  console.log("[Composites] bootstrapping composites");
  await writeComposite(spinner)
  graphiql().then(() => {
    console.log("graphql Server started on http://localhost:5001");
  });
  console.log("Composites] composites bootstrapped");
}

start()
