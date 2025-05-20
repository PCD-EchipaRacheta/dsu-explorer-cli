
async function rename_dsu(dsu, newName) {
    const Registry = require("../registry");
    const registry = new Registry("dsu-registry.json");

    if (!dsu || !newName) {
        throw new Error("DSU name and new name are required.");
    }

    const dsus = registry.entries;
    const dsuEntry = dsus.find(entry => entry.name === dsu);

    if (!dsuEntry) {
        throw new Error(`DSU ${dsu} not found.`);
    }

    dsuEntry.name = newName;
    await registry.writeToDisk();

    console.log(`DSU renamed to ${newName}`);
}

module.exports = {
    fn: rename_dsu,
    command: "rename-dsu",
    description: "Rename a DSU in the local registry.",
    usage: "rename-dsu <dsu_name> <new_name>",
};