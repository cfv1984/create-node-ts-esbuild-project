import { build } from "esbuild";
import config from "./config.mjs";

(async () => {
  await build(config);
})()