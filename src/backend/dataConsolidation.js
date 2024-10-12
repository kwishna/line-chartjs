const fs = require('fs');
const path = require('path');
const {Sequelize} = require('sequelize');
const dbSchema = require('./dbSchema');

// Collect data from all DB files
const readDatabaseFiles = async (folderPath) => {

    if (!fs.existsSync(folderPath)) { // If folder doesn't exist.
        fs.mkdirSync(folderPath); // Create input folder.
        return [];
    }

    // Filter DB files.
    const files = fs.readdirSync(folderPath); // All files in folder.
    const dbFiles = files.filter(file => file.endsWith('.db') || file.endsWith(".sqlite") || file.endsWith(".sqlite3"));

    // Consolidated data variable.
    let consolidatedData = [];

    // Iterate through each DB files.
    for (const file of dbFiles) {
        const dbPath = path.join(folderPath, file);

        // Sequelize DB.
        const tempSequelize = new Sequelize({
            dialect: 'sqlite',
            storage: dbPath,
            logging: false
        });

        // DB model.
        const tempDbModel = tempSequelize.define('TestResult', dbSchema);

        // Read data from DB.
        let rows = [];
        try {
            // Read all DB data.
            rows = await tempDbModel.findAll();
        } catch (e) {
            console.error(`Error reading DB file: ${e}`);
        }

        // Consolidate all data from table in single variable.
        consolidatedData = consolidatedData.concat(rows.map(row => row?.dataValues));
    }
    return consolidatedData;
};

module.exports = readDatabaseFiles;
