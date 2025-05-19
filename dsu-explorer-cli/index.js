process.env.SSO_SECRETS_ENCRYPTION_KEY = "placeholder";
require("../opendsu-sdk/builds/output/openDSU");
const openDSU = require("opendsu")
const fs = require("fs");
const path = require("path");

const resolver = openDSU.loadApi("resolver");
const keySSISpace = openDSU.loadApi("keyssi");

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case "init-dsu":
    createDSU(args[1]);
    break;
  case "list-dsus":
    return listDSUs();
    break;
  case "help":
    return showHelp();
    break;
  case "ls":
    const dsuName = args[1];
    let recursive = false;
    if(args[2] && args[2] == "-r"){
      recursive = true;
    }
    if (!dsuName) {
        return console.error("Please provide a DSU name. Usage: node index.js ls \"DSU Name\"");
    }
    return listFiles(dsuName, recursive);
  case "touch":
    const targetDSU = args[1];
    const targetPath = args[2];
    const content = args.slice(3).join(" ") || "";
    if (!targetDSU || !targetPath) {
      return console.error('Usage: node index.js touch "DSU Name" /file.txt "optional content"');
    }
    return writeFileToDSU(targetDSU, targetPath, content);  
  case "cat":
    const dsuName1 = args[1];
    const filePath = args[2];
    if(!dsuName1 || !filePath) {
      return console.error('Usage: node index.js cat "DSU Name" /file.txt');
    }
    return readFileFromDSU(dsuName1, filePath);
  case "stat":
    const targetName = args[1];
    if (!targetName) {
      return console.error("Usage: node index.js history \"DSU Name\" [/path/to/file]");
    }
    return showStat(targetName);
  case "rename":
    const oldName = args[1];
    const newName = args[2];

    if (!oldName || !newName) {
      return console.error("Usage: node index.js rename \"Old DSU Name\" \"New DSU Name\"");
    }

    return renameDSU(oldName, newName);

  default:
    console.log("Unknown command. Use `help` for more info.");
    break;
}

function createDSU(optionalName) {
  const seedSSI = keySSISpace.createSeedSSI("default");

  resolver.createDSU(seedSSI, (err, dsuInstance) => {
    if (err) return console.error("Failed to create DSU:", err);

    dsuInstance.beginBatch();

    const content = "This is a new DSU created by CLI.\n";
    dsuInstance.writeFile("/info.txt", content, (err) => {
      if (err) return console.error("Failed to write file:", err);

      dsuInstance.commitBatch((err) => {
        if (err) return console.error("Failed to commit batch:", err);

        dsuInstance.getKeySSIAsString((err, keySSI) => {
          if (err) return console.error("Failed to get KeySSI:", err);

          fs.writeFileSync(path.join(__dirname, "dsu-keyssi.txt"), keySSI, "utf8");

          // Load existing registry or create new one
          const registryPath = path.join(__dirname, "dsu-registry.json");
          let registry = [];
          if (fs.existsSync(registryPath)) {
            registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
          }

          // Use provided name or auto-generate one
          const dsuName = optionalName || `New DSU #${registry.length + 1}`;

          // Add entry to registry
          const entry = { name: dsuName, keySSI };
          registry.push(entry);
          fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), "utf8");

          console.log(`DSU "${dsuName}" created and registered.`);
          console.log("KeySSI:", keySSI);
        });
      });
    });
  });
}

function listDSUs() {
  const registryPath = path.join(__dirname, "dsu-registry.json");

  if (!fs.existsSync(registryPath)) {
    return console.log("No DSUs registered yet.");
  }

  const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
  if (registry.length === 0) return console.log("Registry is empty.");

  console.log("Registered DSUs:");
  registry.forEach((entry, i) => {
    console.log(`  ${i + 1}. ${entry.name}`);
    console.log(`     KeySSI: ${entry.keySSI}`);
  });
}

function listFiles(name, recursive) {
  const registryPath = path.join(__dirname, "dsu-registry.json");

  if (!fs.existsSync(registryPath)) {
    return console.error("Registry not found. Please run `init` first.");
  }

  const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
  const dsuEntry = registry.find((entry) => entry.name === name);

  if (!dsuEntry) {
    return console.error(`DSU "${name}" not found in registry.`);
  }

  const keySSI = dsuEntry.keySSI;

  resolver.loadDSU(keySSI, (err, dsu) => {
    if (err) {
      return console.error("Failed to load DSU:", err);
    }

    dsu.listFiles("/", { recursive: recursive }, (err, files) => {
      if (err) {
        return console.error("Failed to list files:", err);
      }

      if (files.length === 0) {
        console.log("DSU is empty.");
      } else {
        console.log(`Files in DSU "${name}":`);
        files.forEach((file) => console.log(" -", file));
      }
    });
  });
}

function showHelp() {
  console.log("\n DSU Explorer CLI - Available Commands:");
  console.log("  init             Create a new DSU and write info.txt");
  console.log("  help             Show this help message");
  console.log("  ls               List all files in the DSU");
  console.log("  list-dsus        Show all created DSUs from local registry");
  console.log("\n Make sure 'dsu-keyssi.txt' exists to use 'info'");
}

function writeFileToDSU(dsuName, filePath, content) {
  const registryPath = path.join(__dirname, "dsu-registry.json");

  console.log(filePath)

  if (!fs.existsSync(registryPath)) {
    return console.error("Registry file does not exist.");
  }

  const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
  const entry = registry.find(e => e.name === dsuName);
  if (!entry) return console.error(`DSU "${dsuName}" not found.`);

  resolver.loadDSU(entry.keySSI, (err, dsu) => {
    if (err) return console.error("Could not load DSU:", err);

    dsu.beginBatch();

    dsu.writeFile(filePath, content, (err) => {
      if (err) return console.error(`Failed to write file "${filePath}":`, err);
      console.log(`File "${filePath}" written successfully to DSU "${dsuName}".`);
      
      dsu.commitBatch((err) => {
        if (err) return console.error("Failed to commit batch:", err);
      });
    });
  });
}

function readFileFromDSU(dsuName, filePath) {
  const registryPath = path.join(__dirname, "dsu-registry.json");

  if (!fs.existsSync(registryPath)) {
    return console.error("Registry file does not exist.");
  }

  const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
  const entry = registry.find(e => e.name === dsuName);
  if (!entry) return console.error(`DSU "${dsuName}" not found.`);

  resolver.loadDSU(entry.keySSI, (err, dsu) => {
    if (err) return console.error("Could not load DSU:", err);

    dsu.readFile(filePath, (err, content) => {
      if (err) return console.error(`Could not read file "${filePath}":`, err);

      console.log(`\n--- ${filePath} ---\n${content.toString()}`);
    });
  });
}

function renameDSU(oldName, newName) {
  const registryPath = path.join(__dirname, "dsu-registry.json");

  if (!fs.existsSync(registryPath)) {
    return console.error("DSU registry not found.");
  }

  const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));

  const existing = registry.find((entry) => entry.name === oldName);
  const conflict = registry.find((entry) => entry.name === newName);

  if (!existing) {
    return console.error(`DSU "${oldName}" not found.`);
  }

  if (conflict) {
    return console.error(`A DSU with the name "${newName}" already exists.`);
  }

  existing.name = newName;

  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), "utf8");
  console.log(`Renamed "${oldName}" → "${newName}" successfully.`);
}

