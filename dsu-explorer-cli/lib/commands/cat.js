
async function cat(dsu, file) {
    const DSUManager = require("../dsu");
    const dsuManager = new DSUManager();

    const { dsuInstance, keySSI } = await dsuManager.loadDSU(dsu);
    console.log(`DSU ${dsuInstance} with KeySSI: ${keySSI}`);
    // console.dir(dsuInstance, { depth: null, colors: true });

    const content = await dsuInstance.readFileAsync(file);
    if (!content) {
        console.log("No content found in the DSU.");
        return;
    }
    console.log("Content of the file:");
    console.log(content.toString());
}


module.exports = {
    fn: cat,
    command: "cat",
    description: "Display the contents of a file in the DSU.",
    usage: "cat <dsu_name> <file_path>",
}