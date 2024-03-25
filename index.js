const { prompt } = require('inquirer');
const db = require("./db")

init();

function init() {
    loadPrompts();
}

function loadPrompts() {
    prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices:
                [
                    {
                        name: "View All Employees",
                        value: "view_all_employees"

                    },
                    
                    {
                        name: "Add Employee",
                        value: "add_employee"
                    },
                   
                    {
                        name: "Update Employee Role",
                        value: "update_employee_role"
                    },
                    
                    {
                        name: "View All Departments",
                        value: "view_all_departments"
                    },
                    {
                        name: "Add Department",
                        value: "add_department"
                    },
                    
                    {
                        name: "View All Roles",
                        value: "view_all_roles"
                    },
                    {
                        name: "Add Role",
                        value: "add_role"
                    },
                    
                    {
                        name: "Quit",
                        value: "quit"
                    },
                ],
            name: "userSelection"
        }
    ])
        .then(answers => {
            const choice = answers.userSelection;

            switch (choice) {
                case "view_all_employees":
                    viewAllEmployees();
                    break;

                case "add_employee":
                    addEmployee();
                    break;

                case "update_employee_role":
                    updateEmployeeRole();
                    break;

                case "view_all_departments":
                    viewAllDepartments();
                    break;
                case "add_department":
                    addDepartment();
                    break;

                case "view_all_roles":
                    viewAllRoles();
                    break;
                case "add_role":
                    addRole();
                    break;

                case "quit":
                    quit();
                    break;
                default:
                    quit();
            }
        })
}

function viewAllEmployees() {
    db.findAllEmployees()
        .then(([employeeData]) => {
            const employees = employeeData;
            console.log("\n");
            console.table(employees);
            loadPrompts();
        })

}

function addEmployee() {

    prompt([
        {
            name: "first_name",
            message: "What is the employee's first name"
        },
        {
            name: "last_name",
            message: "What's the employee's last name"
        }
    ])
        .then(res => {
            const first_Name = res.first_name;
            const last_Name = res.last_name;

            db.showRoles()
                .then(([employeeData]) => {
                    const roles = employeeData;
                    const employeeRole = roles.map(({ id, title }) => ({
                        name: title,
                        value: id
                    }));

                    prompt({
                        type: "list",
                        name: "role_id",
                        message: "What is the employee's role?",
                        choices: employeeRole
                    })
                        .then(res => {
                            const role_id = res.role_id;

                            db.findAllEmployees()
                                .then(([employeeData]) => {
                                    const employees = employeeData;
                                    const selectManager = employees.map(({ id, first_name, last_name }) => ({
                                        name: `${first_name} ${last_name}`,
                                        value: id
                                    }));

                                    selectManager.unshift({ name: "None", value: null });

                                    prompt({
                                        type: "list",
                                        name: "manager_id",
                                        message: "Who is the employee's manager?",
                                        choices: selectManager
                                    })
                                        .then(res => {
                                            const employee = {
                                                manager_id: res.manager_id,
                                                role_id: role_id,
                                                first_name: first_Name,
                                                last_name: last_Name
                                            }

                                            return db.addEmployee(employee);
                                        })
                                        .then(() => {
                                            console.log(
                                                `Successfully added ${first_Name} ${last_Name}!`
                                            )
                                            loadPrompts()
                                        }

                                        )

                                })
                        })
                })
        })
}



function updateEmployeeRole() {
    db.findAllEmployees()
        .then(([employeeData]) => {
            const employees = employeeData;
            const updateEmployee = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));


            prompt([
                {
                    type: "list",
                    name: "employee_id",
                    message: "Select the employee you would like to update?",
                    choices: updateEmployee
                }
            ])
                .then(res => {
                    const employee_id = res.employee_id;
                    db.showRoles()
                        .then(([employeeData]) => {
                            const roles = employeeData;
                            const selectRole = roles.map(({ id, title }) => ({
                                name: title,
                                value: id
                            }));


                            prompt([
                                {
                                    type: "list",
                                    name: "role_id",
                                    message: "What is the employees new role?",
                                    choices: selectRole
                                }
                            ])
                                .then(res => db.updateEmployeeRole(employee_id, res.role_id))
                                .then(() => {
                                    console.log("Successfully updated employee's role!")
                                    loadPrompts()
                                }

                                )
                        });
                });
        })
}


function viewAllDepartments() {
    db.showAllDepartments()
        .then(([employeeData]) => {
            const departments = employeeData;
            console.log("\n");
            console.table(departments);
            loadPrompts();
        })

}

function addDepartment() {
    prompt([
        {
            name: "name",
            message: "What is the name of the new department?"
        }
    ])
        .then(res => {
            const name = res;
            db.addDepartments(name)
                .then(() => {
                    console.log(`Successfully added ${name.names} to the database`)
                    loadPrompts();
                })

        })
}



function viewAllRoles() {
    db.showRoles()
        .then(([employeeData]) => {
            const roles = employeeData;
            console.log("\n");
            console.table(roles);
            loadPrompts();
        })

}

function addRole() {
    db.showAllDepartments()
        .then(([employeeData]) => {
            const departments = employeeData;
            const employeeDepartment = departments.map(({ id, name }) => ({
                name: name,
                value: id
            })          

            );
            // console.log(employeeDepartment);
            prompt([
                {
                    name: "role",
                    message: "What is the employee's role?"
                },
                {
                    name: "salary",
                    message: "What is the employee's salary?"
                },
                {
                    type: "list",
                    name: "department_id",
                    message: "In which department does the employee work?",
                    choices: employeeDepartment
                }
            ])
                .then(role => {
                    db.addRole(role)
                        .then(() => {
                            console.log(`Added ${role.titles} to the database`)
                            loadPrompts();
                        })
                })

        })
}



function quit() {
    process.exit();
}