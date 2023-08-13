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
            addRole();
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
            addRole();
            break;
          case "Add Role":
            this.addRole();
            break;
          case "Add Employee":
            addRole();
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
  async viewDepartments() {
    const sql = `SELECT id, department_name AS title FROM department`;
    await db.promise().query(sql)
      .then(([rows]) => {
        console.table("All Departments", rows);
      })
      .catch((err) => {
        console.log(err);
        
      });    
  }
 //View all roles
 viewRoles(){
  const sql = `SELECT role.id,role.title, department.department_name AS department,role.salary
  FROM role
  LEFT JOIN department
  ON role.department_id = department.id
  ORDER BY role.id`;
     db.promise().query(sql)
      .then(([rows]) => {
        console.table("All Roles", rows);
      })
      .catch((err) => {
        console.log(err);
        
      });
  
 }

  //  getDepartmentArray(){
  //   let departmentList = [];
  //   return new Promise((resolve, reject) => {
  //     const sql = `SELECT department_name FROM department`;
  //         db.promise().query(sql)
  //          .then(([rows])=>{
  //           departmentList = rows.map((row) => {
  //             return row["department_name"];
  //           });

  //           resolve(departmentList);
  //          })
  //          .catch((err)=>{
  //           console.log(err);
  //           reject();
  //          })

  //         });

  //    }
  //Add role
  async addRole() {
    let departmentList = [];
    const sql = `SELECT department_name FROM department`;
    await db.promise().query(sql)
      .then(([rows]) => {
        departmentList = rows.map((row) => {
          return row["department_name"];
        });
        cli.addRoleQuestions(departmentList)
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
          });
        });
      })
      .catch((err) => {
        console.log(err);
        // reject();
      });
    // await this.getDepartmentArray()
    // .then((departmentList)=>{
    //  cli.addRoleQuestions(departmentList)
    //     .then((body) => {
    //       const sql = `INSERT INTO role(title,salary,department_id)
    //     VALUES (?,?,(SELECT id FROM department WHERE department_name=?))`;
    //       const params = [body.role, body.salary, body.departmentId];

    //       db.query(sql, params, (err, result) => {
    //         if (err) {
    //           console.log(err.message);
    //           return;
    //         }
    //         console.log(`Added ${params[0]} to database`);
    //       });
    //   //     });
    // })

    // main();
  }
}

const query = new Query();
query.main();
