
async function touch(dsu, file, contents) {
    const DSUManager = require("../dsu");
    const dsuManager = new DSUManager();

    const { dsuInstance, keySSI } = await dsuManager.loadDSU(dsu);
    console.log(`DSU ${dsuInstance} with KeySSI: ${keySSI}`);
    // console.dir(dsuInstance, { depth: null, colors: true });

    if (!contents) {
        contents = "";
    }

    const bactchID = await dsuInstance.safeBeginBatchAsync();
    await dsuInstance.writeFileAsync(file, contents);
    await dsuInstance.commitBatchAsync(bactchID);
}

module.exports = {
    fn: touch,
    command: "touch",
    description: "Create a new file in the DSU.",
    usage: "touch <dsu_name> <file_path> [contents]",
};