const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const TestResultModel = require('./models/testResultModelDef.js')
const dbSchema = require('./models/dbSchema.js')

// Collect data from all DB files
const readDatabaseFiles = async (folderPath) => {
    const files = fs.readdirSync(folderPath);
    const dbFiles = files.filter(file => file.endsWith('.db'));

    let consolidatedData = [];

    for (const file of dbFiles) {
        const dbPath = path.join(folderPath, file);

        // Sequelize DB
        const tempSequelize = new Sequelize({
            dialect: 'sqlite',
            storage: dbPath,
            logging: false
        });

        // DB Model
        const tempTestResult = tempSequelize.define('TestResult', dbSchema);

        // Read data from DB
        const rows = await tempTestResult.findAll();
        consolidatedData = consolidatedData.concat(rows.map(row => row.dataValues));
    }

    return consolidatedData;
};

module.exports = readDatabaseFiles;
