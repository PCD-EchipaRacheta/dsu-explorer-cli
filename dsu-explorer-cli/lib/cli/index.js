

class Cli {
    /**
     * Creates an instance of the CLI.
     * @param {string} programName - The name of the program.
     * @param {string} programDescription - The description of the program.
     */
    constructor(programName, programDescription) {
        this.programName = programName;
        this.programDescription = programDescription;
        this.commands = [];
    }

    /**
     * Adds a command to the CLI.
     * @param {Function} fn - The function to execute for the command.
     * @param {string} name - The name of the command.
     * @param {string} descriptionm - The description of the command.
     * @param {string} usage - The usage information for the command.
     */
    addCommand(fn, name, descriptionm, usage) {
        this.commands.push({
            fn: fn,
            name: name,
            description: descriptionm,
            usage: usage
        });
    }

    /**
     * Lists all available commands, their description and usage.
     */
    help() {
        console.log(`\n${this.programName} - ${this.programDescription}\n`);
        console.log("Available commands:");
        this.commands.forEach(cmd => {
            console.log(`  ${cmd.name}: ${cmd.description}`);
            console.log(`    Usage: ${cmd.usage}`);
        });
    }

    /**
     * Executes a command by its name.
     * @param {string} command - The name of the command to execute.
     * @param {Array} args - The arguments to pass to the command function.
     */
    async run(command, args) {
        const cmd = this.commands.find(c => c.name === command);
        if (!cmd) {
            console.error(`Command "${command}" not found.`);
            this.help();
            return;
        }
        await cmd.fn(...args);
    }
}

module.exports = Cli;