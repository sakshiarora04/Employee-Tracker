//require packages
const db = require("./config/connection");
const cTable = require("console.table");
const chalk = require("chalk");
const boxen = require("boxen");
const cfonts = require("cfonts");
const CLI = require("./lib/cli.js");
// create instance
const cli = new CLI();
class Query {
  main() {
    cli
      .run()
      .then((res) => {
        switch (res.choices) {
          case "View all Departments":
            this.viewDepartments();
            break;
          case "View All Roles":
            this.viewRoles();
            break;
          case "View All Employees":
            this.viewEmployees();
            break;
          case "View employees by manager":
            this.viewEmployeesByManager();
            break;
          case "View employees by department":
            this.viewEmployeesByDepartment();
            break;
          case "View the total utilized budget of a department or all departments":
            this.viewEmployeesBudget();
            break;
          case "Update Employee Role":
            this.updateEmployeeRole();
            break;
          case "Update Employee Manager":
            this.updateEmployeeManagers();
            break;
          case "Add Department":
            this.addDepartment();
            break;
          case "Add Role":
            this.addRole();
            break;
          case "Add Employee":
            this.addEmployee();
            break;
          case "Remove Department":
            this.deleteDepartment();
            break;
          case "Remove Role":
            this.deleteRole();
            break;
          case "Remove Employee":
            this.deleteEmployee();
            break;
          default:
            console.log("Thank you! Bye");
            setTimeout(() => {
              process.exit(1);
            }, 1300);
            db.end();
            break;
        }
        return res.choices;
      })
      .catch((err) => {
        console.log(err);
        console.log("Oops. Something went wrong.");
      });
  }
  // View all departments
  viewDepartments() {
    const sql = `SELECT id, department_name AS title FROM department ORDER BY id`;
    // runs sql command and return rows of data
    db.query(sql, (err, rows) => {
      if (err) {
        console.log({ error: err.message });
        return;
      }
      console.log(chalk.bold.bgCyan("\n Success!"));
      // display data in table form
      console.table("\n  All Departments", rows);
      this.main();
    });
  }

  // View all roles
  viewRoles() {
    // sql command to get title,salary of all departments by joining tables
    const sql = `SELECT role.id,role.title, department.department_name AS department,role.salary
  FROM role
  LEFT JOIN department
  ON role.department_id = department.id
  ORDER BY role.id`;
    // runs sql command and return rows of data
    db.query(sql, (err, rows) => {
      if (err) {
        console.log({ error: err.message });
        return;
      }
      console.log(chalk.bold.bgCyan("\n Success!"));
      console.table("\n  All roles", rows);
      this.main();
    });
  }

  // View all employees
  viewEmployees() {
    // sql command to get title,salary, department, employee name of all employees by joining tables
    const sql = `SELECT e.id, e.first_name, e.last_name, r.title, d.department_name AS department, r.salary, CONCAT(m.first_name," ",m.last_name) As manager
  FROM employee e
  LEFT JOIN role r
  ON e.role_id= r.id
  LEFT JOIN department d
  ON r.department_id= d.id
  LEFT JOIN employee m
  ON e.manager_id= m.id`;
    // runs sql command and return rows of data
    db.query(sql, (err, rows) => {
      if (err) {
        console.log({ error: err.message });
        return;
      }
      console.log(chalk.bold.bgCyan("\n Success!"));
      console.table("All Employess", rows);
      this.main();
    });
  }
  // View employees by manager
  viewEmployeesByManager() {
    // sql command to generate list of managers
    const sqlManager =
      'SELECT CONCAT(first_name," ",last_name) As manager FROM employee';
    // function to create array of managers by passing sql command and column name
    this.getArray(sqlManager, "manager").then((managerList) => {
      // call function to run inquirer prompt question for selecting manager
      cli.viewManager(managerList).then((body) => {
        // sql command to get rows of employees of selected manager
        const sql = `SELECT id, CONCAT(first_name," ",last_name) AS Employee
      FROM employee 
      WHERE manager_id=(SELECT id FROM (SELECT * FROM employee) AS emp WHERE CONCAT(emp.first_name," ",emp.last_name)=?)`;
        // selected manager in body.managerName
        const params = [body.managerName];
        // runs sql command and return rows of data
        db.query(sql, params, (err, rows) => {
          if (err) {
            console.log(err.message);
            return;
          }
          if (!rows.length) {
            console.log(chalk.bold.bgCyan("\n Manager has no employees"));
            this.main();
            return;
          }
          console.log(chalk.bold.bgCyan("\n Success!"));
          console.table(`\n All employees of manager '${params[0]}'`, rows);
          this.main();
        });
      });
    });
  }
  // View employees by department
  viewEmployeesByDepartment() {
    // sql command to generate list of departments
    const sqlDepartment = "SELECT department_name FROM department ORDER BY id";
    // function to create array of departments by passing sql command and column name
    this.getArray(sqlDepartment, "department_name").then((departments) => {
      // call function to run inquirer prompt question for selecting department
      cli.viewEmpDepartment(departments).then((body) => {
        // sql command to get list of employees of selected department
        const sql = `SELECT e.id,CONCAT(e.first_name," ",e.last_name) AS Employees, r.title FROM employee e
        JOIN role r
        ON e.role_id=r.id
        JOIN department d   
        ON r.department_id=d.id
        WHERE d.department_name=?
        ORDER BY e.first_name`;
        // selected department in body.departmentName
        const params = [body.departmentName];
        // runs sql command and return rows of data
        db.query(sql, params, (err, rows) => {
          if (err) {
            console.log(err.message);
            return;
          }
          console.log(chalk.bold.bgCyan("\n Success!"));
          console.table(`\n All employees of department '${params[0]}'`, rows);
          this.main();
        });
      });
    });
  }
  //View the total utilized budget of a department
  viewEmployeesBudget() {
    // sql command to generate list of departments
    const sqlDepartment = "SELECT department_name FROM department ORDER BY id";
    // function to create array of departments by passing sql command and column name
    this.getArray(sqlDepartment, "department_name").then((departments) => {
      // call function to run inquirer prompt question for selecting department
      cli.viewDepartment(departments).then((body) => {
        if (body.department === "no") {
          this.viewAllEmployeesBudget();
          return;
        }
        // sql command to get sum of salaries of selected department
        const sql = `SELECT d.department_name AS Department, SUM(r.salary) AS Total_Salaries FROM employee e
      JOIN role r
      ON e.role_id=r.id
      JOIN department d   
      ON r.department_id=d.id
      WHERE d.department_name=?`;
        // selected department in body.departmentName
        const params = [body.departmentName];
        // runs sql command and return rows of data
        db.query(sql, params, (err, rows) => {
          if (err) {
            console.log(err.message);
            return;
          }
          if(!rows.length){
            console.log('No results found')
          }
          console.log(chalk.bold.bgCyan("\n Success!"));
          console.table(
            `\n Total utilized budget of department '${params[0]}'`,
            rows
          );
          this.main();
        });
      });
    });
  }
  //view all departments Budget
  viewAllEmployeesBudget() {
    // sql command to get sum of salaries of all departments
    const sqlBudget = `SELECT d.department_name AS Department, SUM(r.salary) AS Total_Salaries FROM employee e
  JOIN role r
  ON e.role_id=r.id
  JOIN department d   
  ON r.department_id=d.id
  GROUP BY d.department_name
  ORDER BY d.id`;
    // runs sql command and return rows of data
    db.query(sqlBudget, (err, rows) => {
      if (err) {
        console.log(err.message);
        return;
      }
      console.log(chalk.bold.bgCyan("\n Success!"));
      console.table(`\n Total utilized budget of all departments`, rows);
      this.main();
    });
  }
  //Add department
  addDepartment() {
    // sql command to  insert new department into table
    const sql = `INSERT INTO department (department_name)
    VALUES (?)`;
    // call function to run inquirer prompt question for inputing department name
    cli.addDepartmentQuestions().then((body) => {
      const params = [body.department];
      db.query(sql, params, (err, result) => {
        if (err) {
          console.log({ error: err.message });
          return;
        }
        console.log(chalk.bold.bgCyan("\n Success!"));
        console.log(`\n Added ${params[0]} department to database`);
        this.viewDepartments();
      });
    });
  }

  //Add role
  addRole() {
    // sql command to generate list of departments
    const sql = `SELECT department_name FROM department ORDER BY id`;
    // function to create array of departments by passing sql command and column name
    this.getArray(sql, "department_name").then((departmentList) => {
      // call function to run inquirer prompt question for inputing salary, title and select department
      cli.addRoleQuestions(departmentList).then((body) => {
        // sql command to  insert new role and salary into table role in selected department
        const sql = `INSERT INTO role(title,salary,department_id)
        VALUES (?,?,(SELECT id FROM department WHERE department_name=?))`;
        //input from inquirer asked questions
        const params = [body.role, body.salary, body.department];
        // runs sql command and return rows of data
        db.query(sql, params, (err, result) => {
          if (err) {
            console.log(err.message);
            return;
          }
          console.log(chalk.bold.bgCyan("\n Success!"));
          console.log(`\n Added ${params[0]} role to database`);
          this.viewRoles();
        });
      });
    });
  }
  // Add Employee
  addEmployee() {
    const employeeArr = [];
    // sql command to generate list of roles
    const sqlRole = "SELECT title from role ORDER BY id";
    // sql command to generate list of manager list
    const sqlManager =
      'SELECT CONCAT(first_name," ",last_name) As manager FROM employee';
    // function to create array of roles by passing sql command and column name
    this.getArray(sqlRole, "title").then((roleList) => {
      employeeArr.push(roleList);
    });
    // function to create array of managers by passing sql command and column name
    this.getArray(sqlManager, "manager").then((managerList) => {
      managerList.push("No Manager");
      //generate array of two arrays-rolelist and managerlist and pass to ask questions
      employeeArr.push(managerList);
      // call function to run inquirer prompt question for inputing employee first and last name, select title and select manager
      cli.addEmployeeQuestions(employeeArr).then((body) => {
        // sql command to  insert new employee name into table employee  in selected role and  manager
        const sql = `INSERT INTO employee (first_name,last_name,role_id,manager_id)
            VALUES( ?,?,(SELECT role.id from role  WHERE role.title=?),(SELECT e.id from employee e WHERE CONCAT(e.first_name," ",e.last_name)=?))`;
        //input from inquirer asked questions
        console.log(body.manager);
        const params = [body.first, body.last, body.role, body.manager];
        db.query(sql, params, (err, result) => {
          if (err) {
            console.log(err.message);
            return;
          }
          console.log(chalk.bold.bgCyan("\n Success!"));
          console.log(
            `\n Added ${params[0]} ${params[1]} employee to database`
          );
          this.viewEmployees();
        });
      });
    });
  }
  //Update Employee role
  updateEmployeeRole() {
    const empRoleArr = [];
    // sql command to generate list of roles
    const sqlRole = "SELECT title from role ORDER BY id";
    // sql command to generate list of employee list
    const sqlEmployee =
      'SELECT CONCAT(first_name," ",last_name) As emp FROM employee';
    // function to create array of roles by passing sql command and column name
    this.getArray(sqlRole, "title").then((roleList) => {
      if(!roleList.length){
        console.log('there are no roles to select')
      }
      empRoleArr.push(roleList);
    });
    // function to create array of employees by passing sql command and column name
    this.getArray(sqlEmployee, "emp").then((employeeList) => {
      if(!employeeList.length){
        console.log('there are no employees to select')
      }
      //generate array of two arrays-rolelist and employeelist and pass to ask questions
      empRoleArr.push(employeeList);
      // call function to run inquirer prompt question for selecting title and employee
      cli.updateEmployee(empRoleArr).then((body) => {
        // sql command to update title of selected employee
        const sql = `UPDATE employee
         SET role_id=(SELECT id FROM role WHERE title=?)
         WHERE id=(SELECT e.id FROM (SELECT * FROM employee) AS e WHERE CONCAT(e.first_name," ",e.last_name)=?)`;
        // got input as id from selecting options
        const params = [body.newRole, body.employeeName];
        db.query(sql, params, (err, result) => {
          if (err) {
            console.log(err.message);
            return;
          }
          console.log(chalk.bold.bgCyan("\n Success!"));
          console.log(`\n Updated role for employee ${params[1]}`);
          this.viewEmployees();
        });
      });
    });
  }
  // Update employee managers
  updateEmployeeManagers() {
    const empArr = [];
    // sql command to generate list of managers
    const sqlManager =
      'SELECT CONCAT(first_name," ",last_name) AS manager from employee';
    // sql command to generate list of employees
    const sqlEmployee =
      'SELECT CONCAT(first_name," ",last_name) As emp FROM employee ORDER BY id';
    // function to create array of managers by passing sql command and column name
    this.getArray(sqlManager, "manager").then((managerList) => {
      if(!managerList.length){
        console.log('there are no manager to select')
      }
      managerList.push("No Manager");
      empArr.push(managerList);
    });
    // function to create array of employees by passing sql command and column name
    this.getArray(sqlEmployee, "emp").then((employeesList) => {
      if(!employeesList.length){
        console.log('there are no employees to select')
      }
      empArr.push(employeesList);
      // call function to run inquirer prompt question for selecting manager and employee
      cli.updateEmpManager(empArr).then((body) => {
        const sql = `Update employee 
           SET manager_id=(SELECT emp.id FROM (SELECT * FROM employee) AS emp  WHERE CONCAT(emp.first_name," ",emp.last_name)=?)
           WHERE id=(SELECT e.id FROM (SELECT * FROM employee) AS e  WHERE CONCAT(e.first_name," ",e.last_name)=?)`;
        // got input as id from selecting options
        const params = [body.newManager, body.employeeName];
        // if employee and manager id is same ---Invalid manager selected
        if (params[0] === params[1]) {
          console.log("Invalid manager selected");
          this.main();
          return;
        }
        db.query(sql, params, (err, result) => {
          if (err) {
            console.log(err.message);
            return;
          }
          console.log(chalk.bold.bgCyan("\n Success!"));
          console.log(`\n Updated manager ${params[0]} of employee ${params[1]}`);
          this.viewEmployees();
        });
      });
    });
  }
  //delete department
  deleteDepartment() {
    const sqlDepartment = "SELECT department_name FROM department ORDER BY id";
    this.getArray(sqlDepartment, "department_name").then((departments) => {
      // run function to select department to delete
      cli.viewEmpDepartment(departments).then((body) => {
        // sql command to delete selected department
        const sql = `DELETE FROM department WHERE department_name=?`;
        const params = [body.departmentName];
        db.query(sql, params, (err, rows) => {
          if (err) {
            console.log({ error: err.message });
            return;
          }
          if(!rows.length){
            console.log('there are no departments to select');
            this.main();
            return;
          }
          console.log(chalk.bold.bgCyan("\n Success!"));
          console.log(
            `\n deleted department ${params[0]} deleted successfully!`
          );
          this.viewDepartments();
        });
      });
    });
  }
  //delete role
  deleteRole() {
    const sqlRole = "SELECT title FROM role ORDER BY id";
    this.getArray(sqlRole, "title").then((roleList) => {
      // run function to select role to delete
      cli.viewRole(roleList).then((body) => {
        // sql command to delete selected role
        const sql = `DELETE FROM role WHERE title=?`;
        // role id from value key in object in array
        const params = [body.roleName];
        db.query(sql, params, (err, rows) => {
          if (err) {
            console.log({ error: err.message });
            return;
          }
          if(!rows.length){
            console.log('there are no roles to select');
            this.main();
            return;
          }
          console.log(chalk.bold.bgCyan("\n Success!"));
          console.log(`\n  role ${params[0]} deleted successfully`);
          this.viewRoles();
        });
      });
    });
  }
  //delete employee
  deleteEmployee() {
    const sqlemployee =
      'SELECT CONCAT(first_name," ",last_name) AS employee FROM employee';
    this.getArray(sqlemployee, "employee").then((empList) => {
      // run function to select employee to delete
      cli.viewEmp(empList).then((body) => {
        // sql command to delete selected employee
        const sql = `DELETE FROM employee WHERE CONCAT(first_name," ",last_name)=?`;
        // employee id from value key in object in array
        const params = [body.empName];
        // run delete command
        db.query(sql, params, (err, rows) => {
          if (err) {
            console.log({ error: err.message });
            return;
          }
          if(!rows.length){
            console.log('there are no employees to select');
            this.main();
            return;
          }
          console.log(chalk.bold.bgCyan("\n Success!"));
          console.log(`\n employee ${params[0]} deleted successfully`);
          this.viewEmployees();
        });
      });
    });
  }
  // function to get array by passing sql and column name
  async getArray(sql, value) {
    let arr = [];
    return new Promise((resolve, reject) => {
      db.promise()
        .query(sql)
        .then(([rows]) => {
          // generate array of column from array of objects containing column
          arr = rows.map((row) => {
            return row[value];
          });
          resolve(arr);
        })
        .catch((err) => {
          console.log(err);
          reject();
        });
    });
  }
  // create array of object from array of columns to select particular id
  // createArrOfObjects(List){
  //   let mainList=[];
  //   // generate object with name and value and push into array
  //   List.forEach((m,i) => {
  //     const obj={};
  //     obj.name=m;
  //     obj.value=i+1;
  //      mainList.push(obj);
  //    });
  // return mainList;
  // }
}

db.connect((error) => {
  if (error) throw error;
  console.log(
    chalk.red.bold(
      `====================================================================================`
    )
  );
  // options to design font
  const options = {
    font: "pallet", // define the font face
    align: "left", // define text alignment
    colors: ["system"], // define all colors
    background: "transparent", // define the background color, you can also use `backgroundColor` here as key
    letterSpacing: 4, // define letter spacing
    lineHeight: 1, // define the line height
    space: true, // define if the output text should have empty lines on top and on the bottom
    maxLength: "0", // define how many character can be on one line
    gradient: "blue,green", // define your two gradient colors
    independentGradient: false, // define if you want to recalculate the gradient for each new line
    transitionGradient: false, // define if this is a transition between colors directly
    env: "node", // define the environment cfonts is being executed in
  };
  // boxen to generate box
  console.log(
    boxen(cfonts.render(`EMPLOYEE \n TRACKER`, options).string, {
      titleAlignment: "center",
      padding: 1,
      margin: 1,
      borderStyle: "classic",
      borderColor: "cyan",
    })
  );
  console.log(
    chalk.red.bold(
      `====================================================================================`
    )
  );
  // create query instance
  const query = new Query();
  query.main();
});
