const { faker } = require('@faker-js/faker');
const moment = require('moment');
// const TestResult = require('./dbSchema2');
const { TestResult, syncDatabase, sequelize } = require("./testResultModelDef")

// Function to generate random data for 100 test cases
async function generateRandomTestData(numRecords = 500) {
    await sequelize.sync({ force: true });

    const testRecords = [];

    for (let i = 0; i < numRecords; i++) {
        const testName = faker.lorem.words(3);
        const testOutcome = faker.helpers.arrayElement(['passed', 'failed', 'skipped', 'blocked']);
        const testTags = faker.lorem.words(2);
        // const testExecutionDate = faker.date.past({ years: 1 }); 
        const testExecutionDate = moment(faker.date.between({ from: '2024-01-01', to: '2024-12-31' })).format('DD-MM-YYYY');
        const testEnvironment = faker.helpers.arrayElement(['qa', 'dev', 'uat', 'prod']);
        const errorMessage = testOutcome === 'failed' ? faker.lorem.sentence() : null;
        const testCategory = faker.helpers.arrayElement(['som', 'fs', 'fin', 'sc', 'dwh']);
        const testCaseId = faker.helpers.arrayElement(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);

        // Push the new record into the array
        testRecords.push({
            test_name: testName,
            test_outcome: testOutcome,
            test_tags: testTags,
            test_execution_date: testExecutionDate,
            test_environment: testEnvironment,
            error_message: errorMessage,
            test_category: testCategory,
            test_case_id: testCaseId
        });
        // await TestResult.create(
        //     {
        //         test_name: testName,
        //         test_outcome: testOutcome,
        //         test_tags: testTags,
        //         test_execution_date: testExecutionDate,
        //         test_environment: testEnvironment,
        //         error_message: errorMessage,
        //         test_category: testCategory,
        //         test_case_id: testCaseId
        //     }
        // );
    }

    // Insert records into the TestResult table
    await TestResult.bulkCreate(testRecords);
    console.log(`${numRecords} random test records created successfully!`);
    await sequelize.close();
}

// Call the function to generate and insert 100 records
generateRandomTestData(100)
    .then(() => {
        console.log('Test data generation complete.');
        process.exit(0);
    })
    .catch(err => {
        console.error('Error generating test data:', err);
        process.exit(1);
    });
