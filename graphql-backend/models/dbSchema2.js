const { Model, DataTypes } = require('sequelize');
const moment = require('moment');

// DB table schema
class TestResult extends Model {
    static init(sequelize) {
        super.init(
            {
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
                    type: DataTypes.STRING, // Keep as STRING
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
            },
            {
                sequelize,
                modelName: 'TestResult',
                hooks: {
                    beforeCreate: (test, options) => {
                        if (test.test_execution_date) {
                            // Convert input date to DD-MM-YYYY format
                            const formattedDate = moment(test.test_execution_date, ['DD-MM-YYYY', 'YYYY-MM-DD'], true);
                            if (formattedDate.isValid()) {
                                test.test_execution_date = formattedDate.format('DD-MM-YYYY');
                            } else {
                                throw new Error('Invalid date format. Please use DD-MM-YYYY or YYYY-MM-DD.');
                            }
                        }
                    },
                    beforeUpdate: (test, options) => {
                        if (test.test_execution_date) {
                            // Convert input date to DD-MM-YYYY format
                            const formattedDate = moment(test.test_execution_date, ['DD-MM-YYYY', 'YYYY-MM-DD'], true);
                            if (formattedDate.isValid()) {
                                test.test_execution_date = formattedDate.format('DD-MM-YYYY');
                            } else {
                                throw new Error('Invalid date format. Please use DD-MM-YYYY or YYYY-MM-DD.');
                            }
                        }
                    }
                }
            }
        );
    }
}

module.exports = TestResult;
