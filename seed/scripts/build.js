import { build } from "esbuild";
import config from "./config.js";

(async () => {
  await build(config);
})()