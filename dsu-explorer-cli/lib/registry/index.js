const fs = require("fs");


class Registry {

    /**
     * Creates a new instance of the Registry.
     * 
     * @param {string} [path] - path to the registry file. 
     */
    constructor(path) {
        this.path = path;

        if(fs.existsSync(path)) {
            this.loadFromFile();
        } else {
            this.createNewRegistry();
        }
    }

    /**
     * Adds a new entry to the registry.
     * @param {string} name - The name of the DSU.
     * @param {string} keySSI - The KeySSI of the DSU.
     */
    addEntry(name, keySSI) {
        const entry = { name, keySSI };
        this.entries.push(entry);
    }

    /**
     * Saves the registry to disk.
     */
    writeToDisk() {
        fs.writeFileSync(this.path, JSON.stringify(this.entries, null, 2), "utf8");
    }

    /**
     * Loads the registry from a file.
     */
    loadFromFile() {
        const data = fs.readFileSync(this.path, "utf8");
        this.entries = JSON.parse(data);
    }

    /**
     * Creates a new registry.
     */
    createNewRegistry() {
        this.entries = [];
        this.writeToDisk();
    }

    /**
     * Finds an entry by name.
     * @param {string} name - The name of the DSU.
    */
    findByName(name) {
        return this.entries.find(entry => entry.name === name);
    }

    /**
     * Removes an entry by name.
     */
    removeEntry(name) {
        this.entries = this.entries.filter(entry => entry.name !== name);
    }
};

module.exports = Registry;