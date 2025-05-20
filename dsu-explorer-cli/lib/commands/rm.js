
async function rm(dsu, file) {
    const DSUManager = require("../dsu");
    const dsuManager = new DSUManager();

    const { dsuInstance, keySSI } = await dsuManager.loadDSU(dsu);
    console.log(`DSU ${dsuInstance} with KeySSI: ${keySSI}`);
    // console.dir(dsuInstance, { depth: null, colors: true });

    const batchID = await dsuInstance.safeBeginBatchAsync();
    await dsuInstance.deleteAsync(file);
    await dsuInstance.commitBatchAsync(batchID);
}

module.exports = {
    fn: rm,
    command: "rm",
    description: "Remove a file from the DSU.",
    usage: "rm <dsu_name> <file_path>",
}