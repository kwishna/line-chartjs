const { Sequelize } = require('sequelize');
const path = require('path');
const dbSchema = require("./dbSchema");

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, `../${process.env.DATA_FOLDER ?? "data"}/consolidated.db`),
    logging: false
});

// DB Model
const TestResult = sequelize.define('TestResult', dbSchema);

// Hooks to handle formatting before creating or updating
TestResult.addHook('beforeCreate', (test) => {
    if (test.test_execution_date) {
        const formattedDate = moment(test.test_execution_date, ['DD-MM-YYYY', 'YYYY-MM-DD'], true);
        if (formattedDate.isValid()) {
            test.test_execution_date = formattedDate.format('DD-MM-YYYY');
        } else {
            throw new Error('Invalid date format. Please use DD-MM-YYYY or YYYY-MM-DD.');
        }
    }
});

TestResult.addHook('beforeUpdate', (test) => {
    if (test.test_execution_date) {
        const formattedDate = moment(test.test_execution_date, ['DD-MM-YYYY', 'YYYY-MM-DD'], true);
        if (formattedDate.isValid()) {
            test.test_execution_date = formattedDate.format('DD-MM-YYYY');
        } else {
            throw new Error('Invalid date format. Please use DD-MM-YYYY or YYYY-MM-DD.');
        }
    }
});

// Generate DB file if it does not exist.
const syncDatabase = async () => {
    await sequelize.sync({ force: true });
};

module.exports = {
    sequelize,
    TestResult,
    syncDatabase
};
