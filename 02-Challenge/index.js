const inquirer = require('inquirer');
const mysql = require('mysql');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_mysql_username',
  password: 'dash',
  database: 'your_database_name',
});

// Connect to the database
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
  startApp();
});

// Function to start the application
function startApp() {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all employees',
        'View employees by department',
        'Add employee',
        'Update employee role',
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all employees':
          viewAllEmployees();
          break;

        case 'View employees by department':
          viewEmployeesByDepartment();
          break;

        case 'Add employee':
          addEmployee();
          break;

        case 'Update employee role':
          updateEmployeeRole();
          break;

        case 'Exit':
          connection.end();
          break;
      }
    });
}

// Implement functions for various actions
function viewAllEmployees() {
  // Implement logic to query and display all employees
  // Use connection.query() for MySQL queries
  // Display the results using console.log()
  // Call startApp() at the end to go back to the main menu
}

function viewEmployeesByDepartment() {
  // Implement logic to query and display employees by department
  // Use connection.query() for MySQL queries
  // Display the results using console.log()
  // Call startApp() at the end to go back to the main menu
}

function addEmployee() {
  // Implement logic to add a new employee to the database
  // Use inquirer.prompt() to get user input
  // Use connection.query() for MySQL queries
  // Call startApp() at the end to go back to the main menu
}

function updateEmployeeRole() {
  // Implement logic to update an employee's role in the database
  // Use inquirer.prompt() to get user input
  // Use connection.query() for MySQL queries
  // Call startApp() at the end to go back to the main menu
}
