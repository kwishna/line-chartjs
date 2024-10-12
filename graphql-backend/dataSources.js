class TestResultsAPI {
    constructor({ data }) {
        this.data = data;
    }

    async getAllTestResults() {
        return this.data;
    }

    async getTestResultById(test_case_id) {
        return this.data.find(result => result.test_case_id === test_case_id);
    }

    async filterTestResults(filters) {
        return this.data.filter(item => {
            return Object.keys(filters).every(key => {
                return !filters[key] || item[key] === filters[key];
            });
        });
    }
}

module.exports = TestResultsAPI;
