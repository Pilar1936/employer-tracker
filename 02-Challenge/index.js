const inquirer = require('inquirer');
const table = require('console.table');
const db = require('../02-Challenge/db/connection');
const { exit } = require('process');

// Arrays para almacenar opciones disponibles
const employeesArray = [];
const rolesArray = [];
const departmentsArray = [];

// Funciones relacionadas con la visualización de datos
const viewAllEmployees = () => {
    const query = `SELECT employees.id, employees.first_name AS First, employees.last_name AS Last, roles.title AS Title, departments.name AS Department, roles.salary AS Salary, CONCAT(manager.first_name,' ', manager.last_name) AS Manager
    FROM employees
    LEFT JOIN employees manager on manager.id = employees.manager_id
    INNER JOIN roles ON employees.role_id = roles.id
    INNER JOIN departments ON departments.id = roles.department_id;`;

    db.query(query, (err, res) => {
        if (err) {
            throw err;
        }
        console.log('Viewing all employees');
        console.log('===============================================');
        console.table(res);
        console.log('===============================================');
        startApp();
    });
};

const viewEmployeesByDepartment = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'department',
            message: 'Which Department would you like to view employees in?',
            choices: departmentsArray,
        },
    ]).then((answer) => {
        const query = `SELECT employees.id, employees.first_name AS First, employees.last_name AS Last, roles.title AS Title, departments.name AS Department, roles.salary AS Salary, CONCAT(manager.first_name,' ', manager.last_name) AS Manager
            FROM employees
            LEFT JOIN employees manager on manager.id = employees.manager_id
            INNER JOIN roles ON employees.role_id = roles.id
            INNER JOIN departments ON departments.id = roles.department_id
            WHERE departments.name = ?`;

        db.query(query, answer.department, (err, res) => {
            if (err) {
                throw err;
            }
            console.log('Viewing all employees');
            console.log('===============================================');
            console.table(res);
            console.log('===============================================');
            startApp();
        });
    });
};

const viewRoles = () => {
    const query = `SELECT roles.id, roles.title AS Title, roles.salary AS Salary, departments.name AS Department FROM roles LEFT JOIN departments on roles.department_id = departments.id`;

    db.query(query, (err, res) => {
        if (err) {
            throw err;
        }
        console.log('Viewing all roles');
        console.log('===============================================');
        console.table(res);
        console.log('===============================================');
        startApp();
    });
};

const viewDepartments = () => {
    const query = `SELECT departments.id, departments.name AS Department FROM departments`;

    db.query(query, (err, res) => {
        if (err) {
            throw err;
        }
        console.log('Viewing all departments');
        console.log('===============================================');
        console.table(res);
        console.log('===============================================');
        startApp();
    });
};

// Funciones relacionadas con la adición de datos
const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the first name of the employee you would like to add?',
            name: 'first_name',
        },
        {
            type: 'input',
            message: 'What is the last name of the employee you would like to add?',
            name: 'last_name',
        },
        {
            type: 'input',
            message: 'What is the role ID number of the employee you would like to add?',
            name: 'role',
            validate: function (input) {
                return !isNaN(input) || 'Please enter a valid number for the role ID.';
            },
        },
        {
            type: 'input',
            message: 'What is the manager ID number of the employee you would like to add?',
            name: 'manager',
        },
    ]).then((answers) => {
        // Verificar nuevamente si `answers.role` es un número
        if (isNaN(answers.role)) {
            console.log('Invalid role ID. Please enter a valid number.');
            startApp();  // O regresar al inicio de la aplicación
            return;
        }

        const query = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

        db.query(query, [answers.first_name, answers.last_name, answers.role, answers.manager], (err) => {
            if (err) {
                throw err;
            }
            employeesArray.push(answers.first_name);
            console.log('Added new Employee');
            console.log('===============================================');
            console.table(answers);
            console.log('===============================================');
            startApp();
        });
    });
};

const addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the title of the role you would like to add?',
            name: 'newRole',
        },
        {
            type: 'input',
            message: 'What is the salary of this role?',
            name: 'salary',
        },
        {
            type: 'input',
            message: 'What is the department ID number for this role?',
            name: 'dept_id',
        },
    ]).then((answers) => {
        const query = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;

        db.query(query, [answers.newRole, answers.salary, answers.dept_id], (err) => {
            if (err) {
                throw err;
            }
            rolesArray.push(answers.newRole);
            console.log('Added new Role');
            console.log('===============================================');
            console.table(answers);
            console.log('===============================================');
            startApp();
        });
    });
};

const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What department would you like to add?',
            name: 'newDepartment',
        },
    ]).then((answer) => {
        const query = `INSERT INTO departments (name) VALUES (?)`;

        db.query(query, answer.newDepartment, (err) => {
            if (err) {
                throw err;
            }
            departmentsArray.push(answer.newDepartment);
            console.log('Added new Department');
            console.log('===============================================');
            console.table(answer);
            console.log('===============================================');
            startApp();
        });
    });
};

// Función para iniciar la aplicación
const startApp = async () => {
    await inquirer
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
                    updateRole();
                    break;
                case 'Exit':
                    exit();
                    break;
            }
        });
};

// Llamar a la función para llenar los arrays con datos de la base de datos
populateArrays();

// Llamar a la función para iniciar la aplicación
startApp();

// Función para llenar los arrays con datos de la base de datos
function populateArrays() {
    // Llenar employeesArray
    const queryEmployees = `SELECT first_name FROM employees`;
    db.query(queryEmployees, (err, res) => {
        if (err) {
            throw err;
        }
        res.forEach(({ first_name }) => {
            employeesArray.push(first_name);
        });
    });

    // Llenar rolesArray
    const queryRoles = `SELECT title FROM roles`;
    db.query(queryRoles, (err, res) => {
        if (err) {
            throw err;
        }
        res.forEach(({ title }) => {
            rolesArray.push(title);
        });
    });

    // Llenar departmentsArray
    const queryDepartments = `SELECT name from departments`;
    db.query(queryDepartments, (err, res) => {
        if (err) {
            throw err;
        }
        res.forEach(({ name }) => {
            departmentsArray.push(name);
        });
    });
}

// Función para actualizar el rol de un empleado
const updateRole = () => {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Which employee would you like to update?',
            choices: employeesArray,
            name: 'employeeUpdate',
        },
        {
            type: 'list',
            message: 'Which new role would you like for the employee?',
            choices: rolesArray,
            name: 'roleUpdate',
        },
    ]).then((answers) => {
        const query = `SELECT id FROM roles WHERE title = ?`;
        db.query(query, answers.roleUpdate, (err, result) => {
            if (err) {
                throw err;
            }
            const newId = result[0].id;
            const query2 = `UPDATE employees SET role_id = ? where first_name = ?`;
            db.query(query2, [newId, answers.employeeUpdate], (err, result) => {
                if (err) {
                    throw err;
                }
                console.log("Employee's Role has been updated");
                console.log('===============================================');
                startApp();
            });
        });
    });
};
