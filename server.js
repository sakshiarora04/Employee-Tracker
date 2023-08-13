const db = require("./config/connection");
const express = require("express"); // Import Express.js
const inquirer = require("inquirer");
// Import and require mysql2
const app = express();
const cTable = require("console.table");
const CLI = require("./lib/cli.js");
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
            addRole();
            break;
          case "View employees by department":
            addRole();
            break;
          case "View the total utilized budget of a department":
            addRole();
            break;
          case "Update Employee Role":
            addRole();
            break;
          case "Update Employee Manager":
            addRole();
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
            addRole();
            break;
          case "Remove Role":
            addRole();
            break;
          case "Remove Employee":
            addRole();
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
    const sql = `SELECT id, department_name AS title FROM department`;      
      db.query(sql, (err, rows) => {
        if (err) {
          console.log({ error: err.message });
          return;
        }
        console.table("All Departments", rows);  
        this.main();       
      });      
  }
 //View all roles
 viewRoles(){
  const sql = `SELECT role.id,role.title, department.department_name AS department,role.salary
  FROM role
  LEFT JOIN department
  ON role.department_id = department.id
  ORDER BY role.id`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log({ error: err.message });
      return;
    }
    console.table("All roles", rows);    
    this.main(); 
  }); 
  
 }
//View all employees
viewEmployees(){
  const sql = `SELECT e.id, e.first_name, e.last_name, r.title, d.department_name AS department, r.salary, CONCAT(m.first_name," ",m.last_name) As manager
  FROM employee e
  LEFT JOIN role r
  ON e.role_id= r.id
  LEFT JOIN department d
  ON r.department_id= d.id
  LEFT JOIN employee m
  ON e.manager_id= m.id`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log({ error: err.message });
      return;
    }
    console.table("All Employess", rows);
    this.main();    
  });
}
//Add department
addDepartment(){
  const sql = `INSERT INTO department (department_name)
    VALUES (?)`;
    cli.addDepartmentQuestions()
    .then((body)=>{
      const params = [body.department]; 
  db.query(sql, params, (err, result) => {
    if (err) {
      console.log({ error: err.message });
      return;
    }    
    console.log(`Added ${params[0]} to database`);
    this.viewDepartments(); 
  });
    })  
}
getDepartmentArray(){
    let departmentList = [];
    return new Promise((resolve, reject) => {
      const sql = `SELECT department_name FROM department`;
          db.promise().query(sql)
           .then(([departments])=>{
            departmentList = departments.map((department) => {
              return department["department_name"];
            });

            resolve(departmentList);
           })
           .catch((err)=>{
            console.log(err);
            reject();
           })

          });
     }
     

  //Add role
  addRole() {   
     this.getDepartmentArray()
    .then((departmentList)=>{
     cli.addQuestions(departmentList)
        .then((body) => {
          const sql = `INSERT INTO role(title,salary,department_id)
        VALUES (?,?,(SELECT id FROM department WHERE department_name=?))`;
          const params = [body.role, body.salary, body.departmentId];

          db.query(sql, params, (err, result) => {
            if (err) {
              console.log(err.message);
              return;
            }
            console.log(`Added ${params[0]} to database`);
            this.viewRoles(); 
          });
        });
    });
       
  }
  // Add Employee
  addEmployee() {
    const employeeArr=[];
    let roleList = [];
    let managerList=[];
    const sqlRole='SELECT title from role';
    const sqlManager='SELECT CONCAT(first_name," ",last_name) As manager FROM employee';
    db.promise().query(sqlRole)
    .then(([roles])=>{
      
      roleList=roles.map((role)=>{
        return role['title'];        
      })  
      employeeArr.push(roleList)    
    })

    db.promise().query(sqlManager)
    .then(([managers])=>{      
      managerList=managers.map((manager)=>{
        return manager['manager'];        
      })  
        employeeArr.push(managerList);
        cli.addEmployeeQuestions()
        .then((body)=>{
           const sql = `INSERT INTO role(title,salary,department_id)
             VALUES (?,?,(SELECT id FROM department WHERE department_name=?))`;
          const params = [body.first, body.last, body.roleId,body.managerId];
          db.query(sql, params, (err, result) => {
                    if (err) {
                      console.log(err.message);
                      return;
                    }
                    console.log(`Added ${params[0]} ${params[1]} to database`);
                    this.viewEmployees();
                  });                 
        });     
    });
  
}
}
const query = new Query();
query.main();
