import { writeComposite } from './composites-remote.mjs';
import ora from "ora";
const spinner = ora();
const start = async () => {
  console.log("[Composites] bootstrapping composites");
  await writeComposite(spinner)
  console.log("Composites] composites bootstrapped");
}

start()
