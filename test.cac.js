import cac from "cac";
import consola from "consola";

const cli = cac("next-cli");

cli
    .command("create-page [name]", "这是一段神奇的代码")
    .action((name, options) => {
        consola.error(`成功创建了${name}页面`);
    });

cli.help();
cli.parse();