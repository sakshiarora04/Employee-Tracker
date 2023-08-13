const db = require("./config/connection");
// Import and require mysql2
const app = express();
const cTable = require("console.table");
const CLI = require("./lib/cli.js");
const chalk = require('chalk');
const cli = new CLI();
console.log(chalk.cyan.bold('======================================'));
console.log(``);
console.log(chalk.green.bold('           EMPLOYEE TRACKER           '));
console.log(``);
console.log(chalk.cyan.bold('======================================'));
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
 
  const sqlManager='SELECT CONCAT(first_name," ",last_name) As manager FROM employee';
  this.getArray(sqlManager,'manager')
  .then((managerList)=>{    
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
  const sqlDepartment='SELECT department_name FROM department ORDER BY id';
  this.getArray(sqlDepartment,'department_name')
  .then((departments)=>{
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
  
  const sqlDepartment='SELECT department_name FROM department ORDER BY id';
  this.getArray(sqlDepartment,'department_name')
  .then((departments)=>{
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
    console.log(`\n Added ${params[0]} department to database`);
    this.viewDepartments(); 
  });
    })  
}
   

  //Add role
  addRole() { 
    const sql = `SELECT department_name FROM department ORDER BY id`;  
     this.getArray(sql,'department_name')
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
            console.log(`\n Added ${params[0]} role to database`);
            this.viewRoles(); 
          });
        });
    });
       
  }
  // Add Employee
  addEmployee() {
    const employeeArr=[];    
    const sqlRole='SELECT title from role ORDER BY id';
    const sqlManager='SELECT CONCAT(first_name," ",last_name) As manager FROM employee';
    this.getArray(sqlRole,'title')
    .then((roleList)=>{      
      employeeArr.push(roleList)
     });
     this.getArray(sqlManager,'manager')
    .then((managerList)=>{ 
      const mList=this.createArrOfObjects(managerList);
        employeeArr.push(mList);
        console.log(employeeArr)
        cli.addEmployeeQuestions(employeeArr)
        .then((body)=>{          
           const sql = `INSERT INTO employee (first_name,last_name,role_id,manager_id)
            VALUES( ?,?,(SELECT role.id from role  WHERE role.title=?),?)`;
          const params = [body.first, body.last, body.role, body.manager];
          db.query(sql, params, (err, result) => {
                    if (err) {
                      console.log(err.message);
                      return;
                    }
                    console.log(`\n Added ${params[0]} ${params[1]} employee to database`);
                    this.viewEmployees();
                  });                 
        });     
    });  
}
//Update Employee role
updateEmployeeRole() {
  const empRoleArr=[];     
  const sqlRole='SELECT title from role ORDER BY id';
    const sqlEmployee='SELECT CONCAT(first_name," ",last_name) As emp FROM employee';
    this.getArray(sqlRole,'title')
    .then((roleList)=>{
      const rList=this.createArrOfObjects(roleList);
      empRoleArr.push(rList);
    })
    this.getArray(sqlEmployee,'emp')
    .then((employeeList)=>{
      const empList=this.createArrOfObjects(employeeList);
      empRoleArr.push(empList);
      cli.updateEmployee(empRoleArr)
      .then((body)=>{          
         const sql = `UPDATE employee
         SET role_id=?
         WHERE id=?`;
        const params = [body.newRole, body.employeeName];
        console.log(params)
        db.query(sql, params, (err, result) => {
                  if (err) {
                    console.log(err.message);
                    return;
                  }
                  console.log(`\n Updated role for employee`);
                  this.viewEmployees();
                });                 
      });
    }); 

}
// Update employee managers
updateEmployeeManagers() {
  const empArr=[];   
  const sqlManager='SELECT CONCAT(first_name," ",last_name) AS manager from employee';
    const sqlEmployee='SELECT CONCAT(first_name," ",last_name) As emp FROM employee ORDER BY id';
    this.getArray(sqlManager,'manager')
    .then((managerList)=>{
      const manList=this.createArrOfObjects(managerList);
      empArr.push(manList);
    })
    this.getArray(sqlEmployee,'emp')
    .then((employeesList)=>{
      const empList=this.createArrOfObjects(employeesList);
      empArr.push(empList);
      
        cli.updateEmpManager(empArr)
        .then((body)=>{          
           const sql = `Update employee 
           SET manager_id=?
           WHERE id=?`;
          const params = [body.newManager, body.employeeName];  
                         
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
//delete department
deleteDepartment(){
  const sqlDepartment='SELECT department_name FROM department ORDER BY id';
  this.getArray(sqlDepartment,'department_name')
  .then((departments)=>{
    cli.viewDepartment(departments)
    .then((body)=>{
      const sql = `DELETE FROM department WHERE department_name=?`; 
      const params = [body.departmentName]; 
  db.query(sql,params, (err, rows) => {
    if (err) {
      console.log({ error: err.message });
      return;
    }  
    console.log(`\n department ${params[0]} deleted successfully!`);  
    this.viewDepartments();      
  }); 
    });
  }); 
}
//delete role
deleteRole(){
  const sqlRole='SELECT title FROM role ORDER BY id';
  this.getArray(sqlRole,'title')
  .then((roleList)=>{   
    cli.viewRole(roleList)
    .then((body)=>{
      const sql = `DELETE FROM role WHERE title=?`; 
      const params = [body.roleName]; 
  db.query(sql,params, (err, rows) => {
    if (err) {
      console.log({ error: err.message });
      return;
    }   
    console.log(`\n  role ${params[0]} deleted successfully`); 
    this.viewRoles();      
  }); 
    });
  }); 
}
//delete employee
deleteEmployee(){
  const sqlemployee='SELECT CONCAT(first_name," ",last_name) AS employee FROM employee';
  this.getArray(sqlemployee,'employee')
  .then((empList)=>{
    const eList=this.createArrOfObjects(empList);
    cli.viewEmp(eList)
    .then((body)=>{
      const sql = `DELETE FROM employee WHERE id=?`; 
      const params = [body.empName]; 
  db.query(sql,params, (err, rows) => {
    if (err) {
      console.log({ error: err.message });
      return;
    }   
    console.log(`\n employee deleted successfully`); 
    this.viewEmployees();      
  }); 
    });
  }); 
}
async getArray(sql,value){
  let arr = [];
  return new Promise((resolve, reject) => {    
        db.promise().query(sql)
         .then(([rows])=>{
          arr = rows.map((row) => {
            return row[value];
          });

          resolve(arr);
         })
         .catch((err)=>{
          console.log(err);
          reject();
         });

        });
   }
   
createArrOfObjects(List){
  let mainList=[];
  List.forEach((m,i) => {
    const obj={};       
    obj.name=m;
    obj.value=i+1;
     mainList.push(obj);
   });
return mainList;
}
}
const query = new Query();
query.main();
