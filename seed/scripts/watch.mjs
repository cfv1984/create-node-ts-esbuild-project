import { context } from "esbuild";
import config from "./config.mjs";

const out = console.log.bind(console,"[esbuild:build]");


(async () => {
  out("Watching...");
  const ctx = await context(config);

  await ctx.watch();
})()