process.env.SSO_SECRETS_ENCRYPTION_KEY = "placeholder";
require("../../../opendsu-sdk/builds/output/openDSU");
const openDSU = require("opendsu");
const Registry = require("../registry");

class DSUManager {
    constructor() {
        this.resolver = openDSU.loadApi("resolver");
        this.keySSISpace = openDSU.loadApi("keyssi");
        this.registry = new Registry("dsu-registry.json");
    }

    /**
     * Creates a DSU instance
     * @param {string} seedSSI - The seed SSI
     * @returns {Promise<Object>} - The DSU instance
     */
    createDSUInstance(seedSSI) {
        return new Promise((resolve, reject) => {
            this.resolver.createDSU(seedSSI, (err, dsuInstance) => {
                if (err) { console.log(`Rejecting createDSUInstance ${err}`); return reject(err); }
                resolve(dsuInstance);
            });
        });
    }

    /**
     * Loads a DSU instance from the registry
     * @param {string} keySSI - The KeySSI of the DSU
     * @returns {Promise<Object>} - The DSU instance
     */
    loadDSUInstance(keySSI) {
        return new Promise((resolve, reject) => {
            this.resolver.loadDSU(keySSI, (err, dsuInstance) => {
                if (err) { console.log(`Rejecting loadDSUInstance: ${err}`);  return reject(err); }
                resolve(dsuInstance);
            });
        });
    }

    async listFilesAsync(dsuInstance, path, options) {
        return new Promise((resolve, reject) => {
            dsuInstance.listFiles(path, options, (err, files) => {
                if (err) { console.log(`Rejecting listFilesAsync: ${err}`); return reject(err); }
                resolve(files);
            });
        });
    }

    debug() {
        console.dir(this, { depth: null, colors: true });
    }

    /**
     * Initialize a new DSU and saves it to local registry.
     * 
     * @param {string} name - The name of the DSU to be created.
     */
    async initDSU(name){
        if (!name) {
            throw new Error("DSU name is required.");
        }

        // Check if the DSU already exists in the registry
        const existingEntry = this.registry.findByName(name);
        if (existingEntry) {
            throw new Error(`DSU with name "${name}" already exists in the registry.`);
        }

        // Create a new DSU instance
        const seedSSI = this.keySSISpace.createSeedSSI("default");
        const dsuInstance = await this.createDSUInstance(seedSSI);
        
        
        // Write initial info file
        const content = "This is a new DSU created by CLI.\n";
        
        const batchID = await dsuInstance.safeBeginBatchAsync();
        await dsuInstance.writeFileAsync("/info.txt", content);        
        await dsuInstance.commitBatchAsync(batchID);
        
        // Get the KeySSI and add it to the registry
        const keySSI = await dsuInstance.getKeySSIAsStringAsync();
        this.registry.addEntry(name, keySSI);
        this.registry.writeToDisk();

        return {dsuInstance, keySSI};
    }

    /**
     * Loads a DSU instance from the registry
     * 
     * @param {string} name - The name of the DSU to be loaded. 
    */
    async loadDSU(name) {
        const entry = this.registry.findByName(name);
    
        if (!entry) {
            throw new Error(`DSU with name "${name}" not found in registry.`);
        }
        const keySSI = entry.keySSI;
        console.log(`Loading DSU with KeySSI: ${keySSI}`);
        const dsuInstance = await this.loadDSUInstance(keySSI);

        if (!dsuInstance) {
            throw new Error(`Failed to load DSU with KeySSI: ${keySSI}`);
        }

        return { dsuInstance, keySSI };
    }

};

module.exports = DSUManager;