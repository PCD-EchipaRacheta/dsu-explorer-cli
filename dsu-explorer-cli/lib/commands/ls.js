
async function ls(dsu_name) {
    const DSUManager  = require("../dsu");
    const dsuManager = new DSUManager();

    const { dsuInstance, keySSI } = await dsuManager.loadDSU(dsu_name);
    console.log(`DSU ${dsuInstance} with KeySSI: ${keySSI}`);
    // console.dir(dsuInstance, { depth: null, colors: true });

    const files = await dsuManager.listFilesAsync(dsuInstance, "/", { recursive: true });
    if (files.length === 0) {
        console.log("No files found in the DSU.");
        return;
    }
    console.log("Files in the DSU:");
    files.forEach((file) => {
        console.log(`  - ${file}`);
    });
}

module.exports = {
    fn: ls,
    command: "ls",
    description: "List all files in the DSU.",
    usage: "ls <dsu_name>",
}