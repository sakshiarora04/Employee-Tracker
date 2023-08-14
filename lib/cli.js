const inquirer = require("inquirer"); // inquirer library

class CLI {
  async run() {
    // inquirer prompt questions to select activity
    return await inquirer.prompt([
      {
        type: "list",
        name: "choices",
        message: "What would you like to do?",
        choices: [
          "View all Departments",
          "View All Employees",
          "View All Roles",
          "View employees by manager",
          "View employees by department",
          "View the total utilized budget of a department or all departments",
          new inquirer.Separator("--- Add"),
          "Add Department",
          "Add Role",
          "Add Employee",
          new inquirer.Separator("--- Update"),
          "Update Employee Role",
          "Update Employee Manager",
          new inquirer.Separator("--- Remove"),
          "Remove Department",
          "Remove Role",
          "Remove Employee",
          "Quit",
        ],
      },
    ]);
  }
  // question to input department
  async addDepartmentQuestions() {
    return await inquirer.prompt([
      {
        type: "input",
        name: "department",
        message: "Which is new department?",
        // check empty string
        validate: (department) => {
          if (department) {
            return true;
          } else {
            console.log("Please enter department name");
          }
        },
      },
    ]);
  }
  // question to input role and salary
  async addRoleQuestions(departmentList) {
    return await inquirer.prompt([
      {
        type: "input",
        name: "role",
        message: "What is title of role?",
        validate: (role) => {
          if (role) {
            return true;
          } else {
            console.log("Please enter title");
          }
        },
      },
      {
        type: "input",
        name: "salary",
        message: "What is salary amount?",
        // check empty string and numerical value
        validate: (salary) => {
          if (salary === "" || isNaN(salary)) {
            console.log("\n Please enter valid amount");
          } else {
            return true;
          }
        },
      },
      {
        type: "list",
        name: "department",
        message: "Select department",
        //choose from department list
        choices: departmentList,
      },
    ]);
  }
  async addEmployeeQuestions(employeeArr) {
    return await inquirer.prompt([
      {
        type: "input",
        name: "first",
        message: "What is employee's first name?",
        validate: (first) => {
          if (first) {
            return true;
          } else {
            console.log("Please enter first name");
          }
        },
      },
      {
        type: "input",
        name: "last",
        message: "What is employee's last name?",
        validate: (last) => {
          if (last) {
            return true;
          } else {
            console.log("Please enter last name");
          }
        },
      },
      {
        type: "list",
        name: "role",
        message: "Select role",
        // choose role from list of roles
        choices: employeeArr[0],
      },
      {
        type: "list",
        name: "manager",
        message: "Select manager",
        choices: employeeArr[1],
        // return null if select no manager option
        filter: (answer)=>{          
          if(answer['manager']===answer['role']){          
            return null;
        }
        return answer;
      }
      },
    ]);
  }
  async viewManager(managerList) {
    return await inquirer.prompt([
      {
        type: "list",
        name: "managerName",
        message: "Select manager",
        // choose from manager list
        choices: managerList,
      },
    ]);
  }
  async viewDepartment(departmentList) {
    return await inquirer.prompt([
      {
        type: "list",
        name: "department",
        message: "view by particular department",
        // choose yes to get results from selected department
        // choose no to get results from all departments
        choices: ["yes", "no"],
      },
      {
        type: "list",
        name: "departmentName",
        message: "Select department",
        choices: departmentList,
        when: (answers) => {
          return answers.department === "yes";
        },
      },
    ]);
  }
  async viewEmpDepartment(departmentList){
    return await inquirer.prompt([     
      {
        type: "list",
        name: "departmentName",
        message: "Select department to view employees",
        choices: departmentList,        
      },
    ]);
  }
  async viewRole(rList) {
    return await inquirer.prompt([
      {
        type: "list",
        name: "roleName",
        message: "Select role to delete",
        //choose from roles
        choices: rList,
      },
    ]);
  }
  async viewEmp(empList) {
    return await inquirer.prompt([
      {
        type: "list",
        name: "empName",
        message: "Select employee to delete",
        //choose from employees
        choices: empList,
      },
    ]);
  }
  async updateEmployee(empRoleArr) {
    return await inquirer.prompt([
      {
        type: "list",
        name: "employeeName",
        message: "Select employee to change role?",
        choices: empRoleArr[1],
      },
      {
        type: "list",
        name: "newRole",
        message: "What is their new role?",
        choices: empRoleArr[0],
      },
    ]);
  }
  async updateEmpManager(empArr) {
    return await inquirer.prompt([
      {
        type: "list",
        name: "employeeName",
        message: "Select employee to change manager?",
        choices: empArr[1],
      },
      {
        type: "list",
        name: "newManager",
        message: "Who is their manager?",
        choices: empArr[0],
        // return null if select no manager
        filter: (answer)=>{
          if(answer==='No manager'){
            return null;
        }}
        
      },
    ]);
  }
  
}


module.exports = CLI;
