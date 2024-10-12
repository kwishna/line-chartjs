# Line Chart

A powerful and easy-to-use library for creating an Express dashboard with Chart.js and jQuery. This library helps you visualize data from your database in a clean and interactive dashboard.

## Features

- **Easy Setup**: Quickly set up a dashboard with minimal configuration.
- **Interactive Charts**: Utilize Chart.js for dynamic and interactive charts.
- **Customizable Filters**: Apply various filters to your data and visualize the results.
- **Command-Line Interface**: Simple CLI to provide the database directory.

## Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/get-npm)

## Installation

Install the library using npm:

```sh
    npm install line-chartjs
```

## Usage
To use the library, run the following command, providing the path to your database directory:

```sh
npx line-chartjs "./path/to/your/data" --port 3001
```

## Configuration
The library reads data from the provided directory and serves it via an Express server. The data is expected to be in .db, .sqlite.

## Example Data Format
Ensure your data files are .db, .sqlite3 and schema follow a consistent structure. Example:
```
{
   "test_name": "Test 1",
   "test_outcome": "passed",
   "test_execution_date": "2023-01-01",
   "test_environment": "dev",
   "error_message": "",
   "test_category": "unit",
   "test_case_id": "TC_001"
}

{
   "test_name": "Test 2",
   "test_outcome": "failed",
   "test_execution_date": "2023-10-10",
   "test_environment": "qa",
   "error_message": "Assertion error",
   "test_category": "smoke",
   "test_case_id": "TC_002"
}
```

## Contributing
We welcome contributions to improve this library! To contribute:

## Fork the repository.
    Create a new branch (git checkout -b feature-branch).
    Make your changes and commit them (git commit -am 'Add new feature').
    Push to the branch (git push origin feature-branch).
    Create a new Pull Request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contact
If you have any questions or need further assistance, feel free to open an issue or contact the maintainer.
