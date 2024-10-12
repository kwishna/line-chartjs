$(document).ready(function () {
    let barChartInstance = null;
    let lineChartInstance = null;
    let pieChartInstance = null;
    let apiUrl = '';
    let defaultDateRangeSet = false;

    // Fetch configuration from the backend
    $.ajax({
        url: '/api/config',
        type: 'GET',
        success: function (config) {
            apiUrl = `http://localhost:${config.port}/api/data/filter`;
            fetchData();
        },
        error: function (err) {
            console.error('Error fetching configuration:', err);
        }
    });

    // Fetch data with filter
    $('#fetchData').click(function () {
        fetchData();
    });

    // Handle tab switching without changing URL
    $('#chartTypeTabs a').on('click', function (e) {
        e.preventDefault();
        $(this).tab('show');
        const target = $(this).attr('href');
        $('.tab-pane').removeClass('show active');
        $(target).addClass('show active');
    });

    // Function to fetch data and update charts
    function fetchData() {
        if (!apiUrl) {
            console.error('API URL is not set.');
            return;
        }

        const filters = getFilters();

        $.ajax({
            url: apiUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(filters),
            success: function (data) {
                if (Array.isArray(data) && data.length === 0) {
                    showAlert('Sorry! No data available to display in the chart. Please check your database folder and files!');
                    return;
                }

                if (!defaultDateRangeSet) {
                    setDefaultDateRange(data);
                    defaultDateRangeSet = true;
                }

                const filteredData = filterDataByDateRange(data, filters.start_date, filters.end_date);
                updateCharts(filteredData);
                updateFailedTestsList(filteredData);
            },
            error: function (err) {
                console.error('Error fetching data for chart:', err);
            }
        });
    }

    // Function to get filters from input fields
    function getFilters() {
        const filters = {
            start_date: $('#start_date').val(),
            end_date: $('#end_date').val(),
            test_name: $('#test_name').val(),
            test_outcome: $('#test_outcome').val(),
            test_execution_date: $('#test_execution_date').val(),
            test_environment: $('#test_environment').val(),
            error_message: $('#error_message').val(),
            test_category: $('#test_category').val(),
            test_case_id: $('#test_case_id').val()
        };

        // Remove empty filter fields
        Object.keys(filters).forEach(key => {
            if (!filters[key]) {
                delete filters[key];
            }
        });

        return filters;
    }

    // Function to update charts based on data
    function updateCharts(data) {
        const dates = getUniqueSortedDates(data);
        const passedCounts = getCountsByOutcomeAndDate(data, 'passed');
        const failedCounts = getCountsByOutcomeAndDate(data, 'failed');

        const maxPassedCount = Math.max(...Object.values(passedCounts));
        const maxFailedCount = Math.max(...Object.values(failedCounts));
        const maxYValue = Math.max(maxPassedCount, maxFailedCount);

        const chartData = {
            labels: dates,
            datasets: [
                {
                    label: 'Passed',
                    data: dates.map(date => ({ x: date, y: passedCounts[date] || 0 })),
                    backgroundColor: 'rgba(0, 128, 0, 0.6)', // Green color
                    borderColor: 'rgba(0, 128, 0, 1)',
                    fill: false
                },
                {
                    label: 'Failed',
                    data: dates.map(date => ({ x: date, y: failedCounts[date] || 0 })),
                    backgroundColor: 'rgba(255, 0, 0, 0.6)', // Red color
                    borderColor: 'rgba(255, 0, 0, 1)',
                    fill: false
                }
            ]
        };

        const barCtx = document.getElementById('barChart').getContext('2d');
        const lineCtx = document.getElementById('lineChart').getContext('2d');
        const pieCtx = document.getElementById('pieChart').getContext('2d');

        if (barChartInstance) {
            barChartInstance.destroy();
        }
        if (lineChartInstance) {
            lineChartInstance.destroy();
        }
        if (pieChartInstance) {
            pieChartInstance.destroy();
        }

        barChartInstance = new Chart(barCtx, {
            type: 'bar',
            data: chartData,
            options: getChartOptions(maxYValue)
        });

        lineChartInstance = new Chart(lineCtx, {
            type: 'line',
            data: chartData,
            options: getChartOptions(maxYValue)
        });

        const pieData = {
            labels: ['Passed', 'Failed'],
            datasets: [{
                data: [Object.values(passedCounts).reduce((a, b) => a + b, 0), Object.values(failedCounts).reduce((a, b) => a + b, 0)],
                backgroundColor: ['rgba(0, 128, 0, 0.6)', 'rgba(255, 0, 0, 0.6)'],
                borderColor: ['rgba(0, 128, 0, 1)', 'rgba(255, 0, 0, 1)']
            }]
        };

        pieChartInstance = new Chart(pieCtx, {
            type: 'pie',
            data: pieData,
            options: {
                responsive: true
            }
        });
    }

    // Function to get chart options
    function getChartOptions(maxYValue) {
        return {
            responsive: true,
            scales: {
                x: {
                    type: 'category',
                    title: {
                        display: true,
                        text: 'Execution Date'
                    },
                    time: {
                        unit: 'day',
                        tooltipFormat: 'DD/MM/YYYY',
                        displayFormats: {
                            day: 'DD/MM/YYYY'
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: maxYValue,
                    ticks: {
                        stepSize: 1, // Ensure Y-axis only displays integer values
                        callback: function (value) {
                            if (Number.isInteger(value)) {
                                return value;
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Outcome Count'
                    }
                }
            }
        };
    }

    // Function to get unique sorted dates from data
    function getUniqueSortedDates(data) {
        const dates = data.map(item => item.test_execution_date);
        const uniqueDates = [...new Set(dates)];
        uniqueDates.sort((a, b) => new Date(a) - new Date(b));
        return uniqueDates;
    }

    // Function to get counts by outcome and date from data
    function getCountsByOutcomeAndDate(data, outcome) {
        const counts = {};
        data.forEach(item => {
            const date = item.test_execution_date;
            if (item.test_outcome === outcome) {
                counts[date] = (counts[date] || 0) + 1;
            }
        });
        return counts;
    }

    // Function to update the failed tests list
    function updateFailedTestsList(data) {
        const failedTests = data.filter(item => item.test_outcome === 'failed');
        const failedTestsCount = {};

        failedTests.forEach(test => {
            const testId = test.test_case_id;
            if (!failedTestsCount[testId]) {
                failedTestsCount[testId] = {
                    count: 0,
                    name: test.test_name
                };
            }
            failedTestsCount[testId].count++;
        });

        const sortedFailedTests = Object.keys(failedTestsCount)
            .map(testId => ({
                testId,
                count: failedTestsCount[testId].count
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        const $failedTestsList = $('#failedTestsList');
        $failedTestsList.empty();

        if (sortedFailedTests.length === 0) {
            $failedTestsList.append('<li class="list-group-item">No failed test cases found</li>');
        } else {
            sortedFailedTests.forEach(test => {
                $failedTestsList.append(`<li class="list-group-item">${test.testId} - ${test.count}</li>`);
            });
        }
    }

    // Function to set default date range
    function setDefaultDateRange(data) {
        const dates = data.map(item => item.test_execution_date);
        const minDate = new Date(Math.min(...dates.map(date => new Date(date))));
        const maxDate = new Date(Math.max(...dates.map(date => new Date(date))));

        const formatDate = date => date.toISOString().split('T')[0];

        $('#start_date').val(formatDate(minDate));
        $('#end_date').val(formatDate(maxDate));
    }

    // Function to filter data by date range
    function filterDataByDateRange(data, startDate, endDate) {
        if (!startDate && !endDate) {
            return data;
        }

        const start = startDate ? new Date(startDate) : new Date(Math.min(...data.map(item => new Date(item.test_execution_date))));
        const end = endDate ? new Date(endDate) : new Date(Math.max(...data.map(item => new Date(item.test_execution_date))));

        return data.filter(item => {
            const date = new Date(item.test_execution_date);
            return date >= start && date <= end;
        });
    }

    // Function to show alert for invalid data
    function showAlert(message) {
        $('.custom-alert').remove();

        const alertHtml = `
            <div class="alert alert-danger alert-dismissible fade show custom-alert" role="alert">
                ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `;

        $('body').append(alertHtml);

        setTimeout(() => {
            $('.custom-alert').alert('close');
        }, 5000);
    }
});
