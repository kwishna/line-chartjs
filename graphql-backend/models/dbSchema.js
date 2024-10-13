// const {DataTypes} = require('sequelize');

// // DB table schema
// const dbSchema = {
//     test_name: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     test_outcome: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     test_tags: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     test_execution_date: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     test_environment: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     error_message: {
//         type: DataTypes.TEXT,
//         allowNull: true
//     },
//     test_category: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     test_case_id: {
//         type: DataTypes.STRING,
//         allowNull: false
//     }
// }

// module.exports = dbSchema;

const { DataTypes } = require('sequelize');
const moment = require('moment');

// DB table schema
const dbSchema = {
    test_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    test_outcome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    test_tags: {
        type: DataTypes.STRING,
        allowNull: true
    },
    test_execution_date: {
        type: DataTypes.STRING, // Keep as STRING to store formatted date
        allowNull: false,
        get() {
            const value = this.getDataValue('test_execution_date');
            return value ? moment(value, 'DD-MM-YYYY').format('DD-MM-YYYY') : null; // Format on retrieval
        }
    },
    test_environment: {
        type: DataTypes.STRING,
        allowNull: false
    },
    error_message: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    test_category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    test_case_id: {
        type: DataTypes.STRING,
        allowNull: false
    }
};

module.exports = dbSchema;

