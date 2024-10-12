$(document).ready(function () {
    let chartInstance = null;
    let apiUrl = '';

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

    const fetchData = () => {

        const filters = {
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

        $.ajax({
            url: apiUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(filters),
            success: function (data) {
                if (data?.length === 0) {
                    showAlert(`Sorry! No data available to display in the chart. Please check your database folder and files!`);
                    return;
                }

                // Chart Data
                const dates = getUniqueSortedDates(data);
                const passedCounts = getCountsByOutcomeAndDate(data, 'passed');
                const failedCounts = getCountsByOutcomeAndDate(data, 'failed');

                // Calculate the maximum value in the data
                const maxPassedCount = Math.max(...Object.values(passedCounts));
                const maxFailedCount = Math.max(...Object.values(failedCounts));
                const maxYValue = Math.max(maxPassedCount, maxFailedCount);

                // Chart Design
                const chartData = {
                    labels: dates,
                    datasets: [
                        {
                            label: 'Passed',
                            data: dates.map(date => ({x: date, y: passedCounts[date] || 0})),
                            backgroundColor: 'rgba(0, 128, 0, 0.6)', // Green color
                        },
                        {
                            label: 'Failed',
                            data: dates.map(date => ({x: date, y: failedCounts[date] || 0})),
                            backgroundColor: 'rgba(255, 0, 0, 0.6)', // Red color
                        }
                    ]
                };

                // 2D Chart Box
                const ctx = document.getElementById('testResultsChart').getContext('2d');

                // Destroy the existing chart instance if it exists
                if (chartInstance) {
                    chartInstance.destroy();
                }

                // Create a new chart instance
                chartInstance = new Chart(ctx, {
                    type: 'bar',
                    data: chartData,
                    options: {
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
                    }
                });
            },
            error: function (err) {
                console.error('Error fetching data for chart:', err);
            }
        });
    };

    const getUniqueSortedDates = (data) => {
        const dates = data.map(item => item.test_execution_date);
        const uniqueDates = [...new Set(dates)];
        uniqueDates.sort((a, b) => new Date(a) - new Date(b));
        return uniqueDates;
        // dates.sort((a, b) => new Date(a) - new Date(b));
        // return dates;
    };

    const getCountsByOutcomeAndDate = (data, outcome) => {
        const counts = {};
        data.forEach(item => {
            const date = item.test_execution_date;
            if (item.test_outcome === outcome) {
                counts[date] = (counts[date] || 0) + 1;
            }
        });
        return counts;
    };

    // Alert for invalid data.
    const showAlert = (message) => {
        // Remove any existing alert
        $('.custom-alert').remove();

        // Design alert
        const alertHtml = `
            <div class="alert alert-danger alert-dismissible fade show custom-alert" role="alert">
                ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `;

        // Attach alert to the body.
        const body = $(document).find('body');
        $(body).append(alertHtml);

        // Automatically dismiss the alert after 5 seconds
        setTimeout(() => {
            $('.custom-alert').alert('close');
        }, 5000);
    };

    // Fetch data with filter
    $('#fetchData').click(function () {
        fetchData();
    });

    // Initial fetch without any filters
    fetchData();
});
