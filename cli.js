const cac = require("cac");
const consola = require("consola");
const c = require("picocolors");
const cli = cac("next-cli");
const create = require('./lib/create')
cli
    .version(`next-cli ${require("./package.json").version}`)
    .usage("<command> [options]");

cli.command("create <app-name>", "创建项目").action((name, options) => {
    consola.success(c.blue(c.bold("Next CLI V1.0.0")));
    create(name, options);
});

cli.on("--help", () => {
            console.log(
                    `  Run ${c.yellow(
      `next-cli <command> --help`
    )} for detailed usage of given command.`
  );
});

cli.parse(process.argv);