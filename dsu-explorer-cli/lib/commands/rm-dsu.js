
async function rm_dsu(dsu) {
    const DSUManager = require("../dsu");
    const dsuManager = new DSUManager();

    const entry = await dsuManager.registry.findByName(dsu);

    if (!entry) {
        throw new Error(`DSU ${dsu} not found in the registry.`);
    }

    //remove from the registry
    await dsuManager.registry.removeEntry(entry.name);
    await dsuManager.registry.writeToDisk();
}

module.exports = {
    fn: rm_dsu,
    command: "rm-dsu",
    description: "Remove a DSU from the registry.",
    usage: "rm-dsu <dsu_name>",
}