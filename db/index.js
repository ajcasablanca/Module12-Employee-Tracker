const connection = require("./connection");

class Database {
    constructor(connection) {
        this.connection = connection;
    }


    findAllEmployees() {
        return this.connection.promise().query(
            "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS 'department', role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id;",
        );
    }

    findManagers(employeeId) {
        return this.connection.promise().query(
            "SELECT id, first_name, last_name FROM employee WHERE id != ?", employeeId
        );
    }

    addEmployee(employee) {
        return this.connection.promise().query("INSERT INTO employee SET ?", employee);
    }

    updateEmployeeRole(employee_id, role_id) {
        return this.connection.promise().query("UPDATE employee SET role_id = ? WHERE id = ?", [role_id, employee_id])
    }

    showRoles() {
        return this.connection.promise().query("SELECT id, title, salary FROM role")
    }

    addRole(role) {
        return this.connection.promise().query("INSERT INTO role SET ?", role);
    }

    showAllDepartments() {
        return this.connection.promise().query("SELECT id, name FROM department");
    }

    addDepartments(department) {
        return this.connection.promise().query("INSERT INTO department SET ?", department);
    }

}

module.exports = new Database(connection);