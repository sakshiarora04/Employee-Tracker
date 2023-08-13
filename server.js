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
            this.viewEmployeesByManager();
            break;
          case "View employees by department":
            this.viewEmployeesByDepartment();
            break;
          case "View the total utilized budget of a department":
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
    const sql = `SELECT id, department_name AS title FROM department ORDER BY id`;      
      db.query(sql, (err, rows) => {
        if (err) {
          console.log({ error: err.message });
          return;
        }
        console.table("\n  All Departments", rows);  
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
    console.table("\n  All roles", rows);    
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
//View employees by manager
viewEmployeesByManager(){
  let managerList=[];
  const sqlManager='SELECT CONCAT(first_name," ",last_name) As manager FROM employee';
  
  db.promise().query(sqlManager)
  .then(([managers])=>{      
    managerList=managers.map((manager)=>{
      return manager['manager'];        
    })       
      cli.viewManager(managerList)
      .then((body)=>{          
        const sql = `SELECT id, CONCAT(first_name," ",last_name) AS Employee
        FROM employee 
        WHERE manager_id=(SELECT id FROM (SELECT * FROM employee) AS emp WHERE CONCAT(emp.first_name," ",emp.last_name)=?)`;
        const params = [body.managerName];
        db.query(sql, params, (err, rows) => {
                  if (err) {
                    console.log(err.message);
                    return;
                  }
                  console.table(`\n All employees of manager '${params[0]}'`, rows);    
                  this.main();                   
                });                 
      });     
  });  
}
// View employees by department
viewEmployeesByDepartment(){
  let departments=[];
  const sqlDepartment='SELECT department_name FROM department';
  
  db.promise().query(sqlDepartment)
  .then(([department])=>{      
    departments=department.map((d)=>{
      return d['department_name'];        
    })       
      cli.viewDepartment(departments)
      .then((body)=>{          
        const sql = `SELECT e.id,CONCAT(e.first_name," ",e.last_name) AS Employees, r.title FROM employee e
        JOIN role r
        ON e.role_id=r.id
        JOIN department d   
        ON r.department_id=d.id
        WHERE d.department_name=?
        ORDER BY e.first_name`;
        const params = [body.departmentName];
        db.query(sql, params, (err, rows) => {
                  if (err) {
                    console.log(err.message);
                    return;
                  }
                  console.table(`\n All employees of department '${params[0]}'`, rows);    
                  this.main();                   
                });                 
      });     
  });
}
//View the total utilized budget of a department
viewEmployeesBudget(){
  let departments=[];
  const sqlDepartment='SELECT department_name FROM department';
  
  db.promise().query(sqlDepartment)
  .then(([department])=>{      
    departments=department.map((d)=>{
      return d['department_name'];        
    })       
      cli.viewDepartment(departments)
      .then((body)=>{          
        const sql = `SELECT d.department_name AS Department, SUM(r.salary) AS Total_Salaries FROM employee e
        JOIN role r
        ON e.role_id=r.id
        JOIN department d   
        ON r.department_id=d.id
        WHERE d.department_name=?`;
        const params = [body.departmentName];
        db.query(sql, params, (err, rows) => {
                  if (err) {
                    console.log(err.message);
                    return;
                  }
                  console.table(`\n Total utilized budget of department '${params[0]}'`, rows);    
                  this.main();                   
                });                 
      });     
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
    console.log(`\n Added ${params[0]} to database`);
    this.viewDepartments(); 
  });
    })  
}
getDepartmentArray(){
    let departmentList = [];
    return new Promise((resolve, reject) => {
      const sql = `SELECT department_name FROM department ORDER BY id`;
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
           });

          });
     }
     

  //Add role
  addRole() {   
     this.getDepartmentArray()
    .then((departmentList)=>{
     cli.addRoleQuestions(departmentList)
        .then((body) => {
          const sql = `INSERT INTO role(title,salary,department_id)
        VALUES (?,?,(SELECT id FROM department WHERE department_name=?))`;
          const params = [body.role, body.salary, body.department];

          db.query(sql, params, (err, result) => {
            if (err) {
              console.log(err.message);
              return;
            }
            console.log(`\n Added ${params[0]} to database`);
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
    const sqlRole='SELECT title from role ORDER BY id';
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
        cli.addEmployeeQuestions(employeeArr)
        .then((body)=>{          
           const sql = `INSERT INTO employee (first_name,last_name,role_id,manager_id)
            VALUES( ?,?,(SELECT role.id from role  WHERE role.title=?),?)`;
          const params = [body.first, body.last, body.role, body.manager+1];
          db.query(sql, params, (err, result) => {
                    if (err) {
                      console.log(err.message);
                      return;
                    }
                    console.log(`\n Added ${params[0]} ${params[1]} to database`);
                    this.viewEmployees();
                  });                 
        });     
    });  
}
updateEmployeeRole() {
  const empRoleArr=[];   
  let employeeList=[];  
  let roleList=[]; 
  const sqlRole='SELECT title from role ORDER BY id';
    const sqlEmployee='SELECT CONCAT(first_name," ",last_name) As emp FROM employee';
    db.promise().query(sqlRole)
    .then(([roles])=>{      
      roleList=roles.map((role)=>{
        return role['title'];        
      })  
      empRoleArr.push(roleList)    
    })
    db.promise().query(sqlEmployee)
    .then(([employees])=>{      
      employeeList=employees.map((employee)=>{
        return employee['emp'];        
      })
      empRoleArr.push(employeeList);
        cli.updateEmployee(empRoleArr)
        .then((body)=>{          
           const sql = `UPDATE employee
           SET role_id=?
           WHERE id=?`;
          const params = [body.newRole+1, body.employeeName+1];
          db.query(sql, params, (err, result) => {
                    if (err) {
                      console.log(err.message);
                      return;
                    }
                    console.log(`\n Updated ${params[0]} for ${params[1]} to database`);
                    this.viewEmployees();
                  });                 
        });     
    });  
    
}
// Update employee managers
updateEmployeeManagers() {
  const empArr=[];   
  let employeeList=[];  
  let managerList=[]; 
  let empList=[];
  let manList=[];
  const sqlManager='SELECT CONCAT(first_name," ",last_name) AS manager from employee';
    const sqlEmployee='SELECT CONCAT(first_name," ",last_name) As emp FROM employee ORDER BY id';
    db.promise().query(sqlManager)
    .then(([managers])=>{      
      managerList=managers.map((manager)=>{
        return manager['manager'];        
      }) 
       managerList.forEach(m,i => {
        const obj={};       
        obj.name=m;
        obj.value=i+1;
         manList.push(obj);
       });
      empArr.push(manList)    
    })
    db.promise().query(sqlEmployee)
    .then(([employees])=>{      
      employeeList=employees.map((employee)=>{
        return employee['emp'];        
      })
      
      for (let i = 0; i < employeeList.length; i++) {
       let obj={};       
       obj.name=employeeList[i];
       obj.value=i+1;
        empList.push(obj);
      }
      empArr.push(empList);  
      console.log(empArr)    
        cli.updateEmpManager(empArr)
        .then((body)=>{          
           const sql = `Update employee 
           SET manager_id=?
           WHERE id=?`;
          const params = [body.newManager, body.employeeName];  
          console.log(params)               
          if(params[0]===params[1]){
            console.log('Invalid manager selected');
            this.main();
            return;
          }
          db.query(sql, params, (err, result) => {
                    if (err) {
                      console.log(err.message);
                      return;
                    }
                   console.log(`\n Updated manager`);
                    this.viewEmployees();
                  });                 
        });     
    });  
    
}
}
const query = new Query();
query.main();
