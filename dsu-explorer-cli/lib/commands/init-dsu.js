
/**
 * Initialize a new DSU and saves it to local registry.
 *  
 * @param {string} name - The name of the DSU to be created.
 */
async function init_dsu(name) {

    if (!name) {
        throw new Error("DSU name is required.");
    }

    const DSUManager = require("../dsu");
    const dsuManager = new DSUManager();

    const { dsuInstance, keySSI } = await dsuManager.initDSU(name);
    console.log(`DSU ${name} created with KeySSI: ${keySSI}`);
}

module.exports = {
    fn: init_dsu,
    command: "init-dsu",
    description: "Initialize a new DSU and saves it to local registry.",
    usage: "init-dsu <name>",
};