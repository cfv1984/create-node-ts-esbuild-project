import { readFileSync} from "fs";
import { resolve, dirname } from "node:path";

const { env } = process;
const { NODE_ENV } = env;
const { cwd } = process;
const out = console.log.bind(console,"[esbuild:build]")

/**
 * @type { import("esbuild").BuildOptions }
 */
const config = {
  minify: (NODE_ENV && NODE_ENV !== "development") || Boolean(env.MINIFY),
  outdir:"./dist",
  bundle: true,
  entryPoints:[resolve(cwd(),"src","index.ts")],
  tsconfigRaw: readFileSync(resolve(cwd(), "tsconfig.json"), "utf-8"),
  platform:"node",
  plugins:[
    {
      name:"Notify on end",
      setup(build){
        build.onStart(() => out("Building..."));
        build.onEnd(() => out("Built"));
      }
    }
  ]
}
export default config;