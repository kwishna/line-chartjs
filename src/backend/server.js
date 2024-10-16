const { resolve, join } = require('path')
const express = require('express');
const cors = require('cors');

const PORT = process.env.EXPRESS_PORT || 3001;
const DATA_FOLDER = process.env.DATA_FOLDER ?? './dbFolder';

const readDatabaseFiles = require('./dataConsolidation');

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

    app.post('/api/data/filter', async (req, res) => {
        const allowedKeys = [
            'test_name',
            'test_tags',
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
        /**
         *  [
         *      {
         *          "test_name": "alpha",
         *          "test_tags": "@smoke,@regression,@aat,@supply_chain",
         *          "test_category": "@finance",
         *      },
         *      {
         *          "test_name": "beta",
         *          "test_tags": "@smoke,@regression,@ad_systen,@som",
         *          "test_category": "@som",
         *      }
         *  ]
         */
        const data = await readDatabaseFiles(resolve(DATA_FOLDER));

        // Filter the data
        const filteredData = data.filter(item => {
            return Object.keys(filters).every(key => {
                if (key === 'test_tags') {
                    const allTags = item[key].split(",").map(tag => tag?.trim()?.toLowerCase());
                    return allTags?.includes(filters[key]?.trim()?.toLowerCase());
                }
                else if (key === 'error_message') {
                    return item[key]?.toLowerCase().includes(filters[key]?.toLowerCase());
                }
                return item[key] === filters[key];
            });
        });

        res.json(filteredData);
    });

    // Fallback
    app.use((req, res, next) => {
        res.status(404).json({ error: 'API endpoint/request is not supported.' });
    });

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

module.exports = createServer;
// createServer() // Debugging...
