async function stat(dsu, file) {
    const DSUManager = require("../dsu");
    const dsuManager = new DSUManager();

    const { dsuInstance, keySSI } = await dsuManager.loadDSU(dsu);
    console.log(`DSU ${dsuInstance} with KeySSI: ${keySSI}`);
    // console.dir(dsuInstance, { depth: null, colors: true });

    const stats = await dsuInstance.statAsync(file);
    if (!stats) {
        console.log("No stats found for the file.");
        return;
    }
    console.log("File stats:");
    console.log(stats);
}

module.exports = {
    fn: stat,
    command: "stat",
    description: "Display the stats of a file in the DSU.",
    usage: "stat <dsu_name> <file_path>",
};