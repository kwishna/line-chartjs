const {DataTypes} = require('sequelize');

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
        type: DataTypes.DATE,
        allowNull: false
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
}

module.exports = dbSchema;
