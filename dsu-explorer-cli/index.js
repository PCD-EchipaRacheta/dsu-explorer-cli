
const Cli = require("./lib/cli");
const commands = require("./lib/commands");

(async function main() {
  
  cli = new Cli("dsu-explorer", "CLI to explore and manage DSUs");
  
  for (const command of commands.list) {
    cli.addCommand(command.fn, command.command, command.usage, command.description);
  }
  
  const [command, ...args] = process.argv.slice(2);

  await cli.run(command, args);
})();
