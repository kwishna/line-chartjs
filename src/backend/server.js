const {resolve, join} = require('path')
const express = require('express');
const cors = require('cors');

const PORT = process.env.EXPRESS_PORT || 3001;
const DATA_FOLDER = process.env.DATA_FOLDER ?? './dbFolder';

const readDatabaseFiles = require('./dataConsolidation');
// const {syncDatabase} = require('./testResultModelDef');
// syncDatabase()
//     .then()
//     .catch(err => console.error(err));

const createServer = () => {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.static(join(__dirname, '../frontend')));

    // Serve the index.html file for the root.
    app.all('/', (req, res) => {
        res.sendFile(join(__dirname, '../frontend/index.html'));
    });

    // Endpoint to fetch configuration
    app.get('/api/config', (req, res) => {
        res.json({ port: PORT });
    });

    // All data from DB files.
    // app.get('/api/data', async (req, res) => {
    //     const data = await readDatabaseFiles(resolve(DATA_FOLDER));
    //     res.json(data);
    // });

    // app.get('/api/data/id/:test_case_id', async (req, res) => {
    //     const testCaseId = req.params.test_case_id;
    //     const data = await readDatabaseFiles(DATA_FOLDER);
    //     console.log(data)
    //     const filteredData = data.filter(item => item.test_case_id === testCaseId);
    //     res.json(filteredData);
    // });

    // app.get('/api/data/tags/:test_tags', async (req, res) => {
    //     const testTags = req.params.test_tags;
    //     const data = await readDatabaseFiles(DATA_FOLDER);
    //     const filteredData = data.filter(item => item.testTags === testTags);
    //     res.json(filteredData);
    // });

    app.post('/api/data/filter', async (req, res) => {
        const allowedKeys = [
            'test_name',
            'test_outcome',
            'test_execution_date',
            'test_environment',
            'error_message',
            'test_category',
            'test_case_id'
        ]

        const reqBody = req.body;
        const filters = {};

        // Extract only allowed keys from the request body
        for (const key of allowedKeys) {
            if (reqBody.hasOwnProperty(key)) {
                filters[key] = reqBody[key];
            }
        }

        // Read all data from DB
        const data = await readDatabaseFiles(resolve(DATA_FOLDER));

        // Filter the data
        const filteredData = data.filter(item => {
            return Object.keys(filters).every(key => {
                return item[key] === filters[key];
            });
        });

        res.json(filteredData);
    });

    // Fallback
    app.use((req, res, next) => {
        res.status(404).json({error: 'API endpoint/request is not supported.'});
    });

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

module.exports = createServer;
// createServer() // Debugging...
