
async function list_dsus() {
    const Registry = require("../registry");
    const registry = new Registry("dsu-registry.json");

    const dsus = registry.entries;

    if (dsus.length === 0) {
        console.log("No DSUs registered yet.");
        return;
    }

    console.log("Registered DSUs:");
    dsus.forEach((entry, i) => {
        console.log(`  ${i + 1}. ${entry.name}`);
        console.log(`     KeySSI: ${entry.keySSI}`);
    });
}


module.exports = {
    fn: list_dsus,
    command: "list-dsus",
    description: "List all DSUs in the local registry.",
    usage: "list-dsus",
}