
async function download(dsu, path) {
    if(!dsu) {
        throw new Error("DSU name is required.");
    }
    if(!path) {
        throw new Error("Path is required.");
    }
    
    const DSUManager = require("../dsu");
    const dsuManager = new DSUManager();

    const fs = require("fs");

    const { dsuInstance, keySSI } = await dsuManager.loadDSU(dsu);
    
    const content = await dsuInstance.readFileAsync(path);
    
    if (!content) {
        console.log("No content found in the DSU.");
        return;
    }

    fs.writeFileSync(path, content);
}

module.exports = {
    fn: download,
    command: "download",
    description: "Download a file from the DSU.",
    usage: "download <dsu_name> <path>",
};