const inquirer = require('inquirer'); // inquirer library


class CLI {  
  async run() {
    // inquirer prompt questions related to logo name, color and shape
    return await inquirer
      .prompt([
        {        
          type: 'list',
          name: 'choices',
          message: 'Please select',
          choices:    [  'View all Departments',
            'View All Employees',
          'View All Roles',
          'View employees by manager',
          'View employees by department',
          'View the total utilized budget of a department',
          new inquirer.Separator('--- Add'),
          'Add Department',
          'Add Role',
          'Add Employee',
          new inquirer.Separator('--- Update'),
          'Update Employee Role',
          'Update Employee Manager',          
          new inquirer.Separator('--- Remove'),
          'Remove Department', 
          'Remove Role',         
          'Remove Employee',         
          'Quit']
        },        
      ])
      
  }  
  async addDepartmentQuestions(){
    return await inquirer
       .prompt([
        {
            type: "input",
            name: "department",
      message: "Which is new department?",
      validate: (department) => {
        if (department) {
          return true;
        } else {
          console.log("Please enter department");
        }
      },

        }
    ])
}
 async addRoleQuestions(departmentList){
   return await inquirer
      .prompt([
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
          message: "What is salary?",
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
          choices: departmentList,
        },
      ])
    }
    async addEmployeeQuestions(employeeArr){
        return await inquirer
        .prompt([
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
            choices: employeeArr[0],
          }, 
          {
            type: "list",
            name: "manager",
            message: "Select manager",
            choices: employeeArr[1],            
          },
        ])
    }
    async viewManager(managerList){
        return await inquirer
        .prompt([ 
          {
            type: "list",
            name: "managerName",
            message: "Select manager",
            choices: managerList,
          },
        ])
    }
    async viewDepartment(departmentList){
        return await inquirer
        .prompt([
            {
                type: 'list',
                name: "department",
                message: "view by particular department",
                choices:['yes','no']
              },      

          {
            
            type: "list",
            name: "departmentName",
            message: "Select department",
            choices: departmentList,
            when:(answers)=>{
                return answers.department=== 'yes';
        },
           
          },
        ])
    }

    async updateEmployee(empRoleArr){
        return await inquirer
        .prompt([
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
                   
        ])
    }
    async updateEmpManager(empArr){
        return await inquirer
        .prompt([
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
              },
                   
        ])
    }
    async viewRole(rList){
        return await inquirer
        .prompt([
            {
                type: "list",
                name: "roleName",
                message: "Select role to delete",
                choices: rList,                
              },           
                   
        ])
    }
    async viewEmp(empList){
        return await inquirer
        .prompt([
            {
                type: "list",
                name: "empName",
                message: "Select employee to delete",
                choices: empList,                
              },           
                   
        ])
    }
}
// validSalary(input){    
//     const color=input.toLowerCase();
//     const colorKeywords = ['aliceblue', 'antiquewhite', 'aqua', 'aquaMarine', 'azure', 'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgrey', 'darkgreen', 'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray', 'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'grey', 'green', 'greenyellow', 'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgrey', 'lightgreen', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple', 'rebeccapurple', 'red', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow', 'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen']
//     // filter out matching keyword in array, retuns empty array if it finds no matching word
//     const newArray=colorKeywords.filter(word => word===color);  
//     // check hexadecimal -6 digit starting # 
//     const hexDecRegex = '^#[A-Fa-f0-9]{6}$';
//     //if doesnt match keyword or hexadecimal criteria then return message
//     if ( !newArray.length&& !input.match(hexDecRegex) ) {
//      return 'Please enter valid color';
//    }
//    return true;    
//   }
//   // check logo name length
//   checkTextSize(input){
//     if(input.length>3){
//       return 'Logo text must contain less than or equal to 3 characters';
//     }
//     return true;
//    }
// }

module.exports = CLI;
