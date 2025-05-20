async function upload(dsu, local_file) {
    const DSUManager = require("../dsu");
    const dsuManager = new DSUManager();

    const fs = require("fs");

    const { dsuInstance, keySSI } = await dsuManager.loadDSU(dsu);
    console.log(`DSU ${dsuInstance} with KeySSI: ${keySSI}`);
    // console.dir(dsuInstance, { depth: null, colors: true });

    const contents = fs.readFileSync(local_file);
    if (!contents) {
        console.log("No content found in the local file.");
        return;
    }

    const batchID = await dsuInstance.safeBeginBatchAsync();
    await dsuInstance.writeFileAsync(local_file, contents);
    await dsuInstance.commitBatchAsync(batchID);
}

module.exports = {
    fn: upload,
    command: "upload",
    description: "Upload a file to the DSU.",
    usage: "upload <dsu_name> <local_file_path>",
}