
async function mkdir(dsu, dirname) {
    if(!dsu) {
        throw new Error("DSU name is required.");
    }

    if(!dirname) {
        throw new Error("Directory name is required.");
    }

    const DSUManager = require("../dsu");
    const dsuManager = new DSUManager();


    const {dsuInstance, keySSI} = await dsuManager.loadDSU(dsu);
    // await dsuInstance.mkdir(dirname);
    // console.dir(dsuInstance, { depth: null, colors: true });
    const batchID = await dsuInstance.safeBeginBatchAsync();
    await dsuInstance.createFolderAsync(dirname);
    await dsuInstance.commitBatchAsync(batchID);
}

module.exports = {
    fn: mkdir,
    command: "mkdir",
    description: "Create a directory in the DSU.",
    usage: "mkdir <dsu_name> <directory_path>",
}