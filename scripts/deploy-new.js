import prompts from "prompts";
import { bold } from "kleur/colors";
import { createRequire } from "module";
import { resolve, dirname } from "path";
import { existsSync, promises } from "fs";
import { EOL } from "os";
import { copy } from "fs-extra";
import { fileURLToPath } from 'node:url';
const { cwd } = process;

const require = createRequire(new URL(import.meta.url));

const out = console.log.bind(console, bold("[create-node-ts-esbuild-project]"));

const __dirname = resolve(dirname(fileURLToPath(import.meta.url)));

(async () => {
  out("Creating new NodeJS TS (esbuild) project");

  const startingQuestions = [{
    type:"text",
    name:"projectName",
    "message":"What's your project name?",
    validate: value => Boolean(value)? true : "Projects have names. Think of one"
  },
  
  {
    type:"text",
    name:"projectAuthor",
    message:"Who's this project's author?",
    validate: value => value.length > 0? true: "Projects are made by people. Example: \"John Doe <john.doe@example.com\""
  }, 

  {
    type:"text",
    name:"projectDesc",
    message:"Enter some description of your project (default:none)",
  },
  
  {
    type:"text",
    name:"projectLicense",
    message:"Do you want to publish this project under some specific license? (default: MIT)",
  }
];



   const { projectName, projectAuthor, projectDesc, projectLicense} = await prompts(startingQuestions);

   const pkg = structuredClone(require(resolve(cwd(), "./package.json")));

   pkg.name= projectName;
   pkg.author= projectAuthor;
   pkg.description= projectDesc||"";
   pkg.license= projectLicense||"MIT";

  await copy(resolve(__dirname, "seed"), cwd());

  await promises.writeFile(resolve(cwd(), "package.json"), JSON.stringify(pkg, null, "  "));

  out("KTXBAI")

})();


function camelCaseToSnakeCase(str){
  return str.replace(/([a-zA-Z])(?=[A-Z])/g,'$1_')
}

function snakeCaseToCamelCase(str){
  const fragments = str.split("_").map(s => [s[0].toUpperCase(), s.slice(1)]).join("")
}

async function makeFilesList(path=resolve(cwd(),"./")){

  const found = [] 
  const files = await promises.readdir(path, { recursive: true, withFileTypes: true});
  const ignorePath = resolve(cwd(),path,"./.gitignore");
  let ignore = []
  if(existsSync(ignorePath)){
    ignore = (await promises.readFile(ignorePath,"utf-8")).split(EOL);
  }

  for(const file of files){
    if(file.isFile()){
    found.push(resolve(path, file.name));
    }
    if(file.isDirectory() && !ignore.some(i => resolve(file.parentPath||"", file.name).includes(i))){
      found.push(...(await makeFilesList(resolve(file.parentPath||"", file.name))))
    }
  }

  return found;
}