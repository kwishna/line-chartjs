const {Sequelize} = require('sequelize');
const path = require('path');
const {dbSchema} = require("./dbSchema");

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, `../${process.env.DATA_FOLDER}/consolidated.db`),
    logging: false
});

// Define Test Model
const defineTestModel = function (sequelize) {
    return sequelize.define('TestResult', dbSchema);
};

// DB Model
const TestResult = defineTestModel(sequelize);

// Generate DB file if it does not exist.
const syncDatabase = async () => {
    await sequelize.sync({force: false});
};

module.exports = {
    sequelize,
    TestResult,
    syncDatabase
};
