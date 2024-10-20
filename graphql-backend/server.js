const express = require('express');
const {ApolloServer} = require('@apollo/server');
const {expressMiddleware} = require('@apollo/server/express4');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const readDatabaseFiles = require('./dataConsolidation');
const {syncDatabase} = require('./models/testResultModelDef.js');
const {typeDefs, resolvers} = require('./schema');
const TestResultsAPI = require('./dataSources');

const app = express();
const port = 3001;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, './')));

syncDatabase().then().catch(console.error);

const startServer = async () => {
    const data = await readDatabaseFiles('./dbFolder');

    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await server.start();

    app.use(
        '/graphql',
        cors(),
        bodyParser.json(),
        expressMiddleware(server, {
            context: async () => ({
                dataSources: {
                    testResultsAPI: new TestResultsAPI({data}),
                },
            }),
        })
    );

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, './index.html'));
    });

    // Fallback route for handling undefined routes
    app.use((req, res, next) => {
        res.status(404).json({error: 'API endpoint not found.'});
    });

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/graphql`);
    });
};

startServer();
