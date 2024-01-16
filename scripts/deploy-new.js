#! /usr/bin/env node
import prompts from "prompts";
import { bold } from "kleur/colors";
import { createRequire } from "module";
import { resolve, dirname } from "path";
import { promises } from "fs";
import { copy } from "fs-extra";
import { fileURLToPath } from "node:url";

const { cwd }       = process;
const require       = createRequire(new URL(import.meta.url));
const out           = console.log.bind(console, bold("[create-node-ts-esbuild-project]"));
const moduleDirname = resolve(dirname(fileURLToPath(import.meta.url)));

(async () => {
  out("Creating new NodeJS TS (esbuild) project");

  const startingQuestions = [
    {
      type: "text",
      name: "projectName",
      message: "What's your project name?",
      validate: (value) =>
        Boolean(value) ? true : "Projects have names. Think of one",
    },
    {
      type: "text",
      name: "projectAuthor",
      message: "Who's this project's author?",
      validate: (value) =>
        value.length > 0
          ? true
          : 'Projects are made by people. Example: "John Doe <john.doe@example.com"',
    },
    {
      type: "text",
      name: "projectDesc",
      message: "Enter some description of your project (default:none)",
    },
    {
      type: "text",
      name: "projectLicense",
      message:
        "Do you want to publish this project under some specific license? (default: MIT)",
    },
  ];

  const { projectName, projectAuthor, projectDesc, projectLicense } =
    await prompts(startingQuestions);

  const pkg = structuredClone(
    require(resolve(moduleDirname, "..", "seed", "./package.json"))
  );

  pkg.name        = projectName;
  pkg.author      = projectAuthor;
  pkg.description = projectDesc || "";
  pkg.license     = projectLicense || "MIT";

  await copy(resolve(moduleDirname, "..", "seed"), cwd(), {
    filter(path) {
      return (
        (path.includes("node_modules") ||
          path.includes("ignore") ||
          path.startsWith(".")) === false
      );
    },
  });

  await promises.writeFile(
    resolve(cwd(), "package.json"),
    JSON.stringify(pkg, null, "  ")
  );

  out("KTXBAI");
})();
