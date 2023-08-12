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
          choices:    [  'View all departments',
            'View All Employees',
          'View All Roles',
          'View All Departments',
          'View All Employees By Department',
          'View Department Budgets',
          new inquirer.Separator('--- Update'),
          'Update Employee Role',
          'Update Employee Manager',
          'Add Employee',
          'Add Role',
          'Add Department',
          'Remove Employee',
          'Remove Role',
          'Remove Department',
          'Quit']
        },
        // {
        //   type: 'input',
        //   name: 'role',
        //   message: 'Name of role', 
        //   when: (answers) => answers['choices'] === 'Add Role',       
        // },
        // {
        //     type: 'input',
        //     name: 'salary',
        //     message: 'What Salary', 
        //     when: (answers) => answers.role === 'role',       
        //   },
        // {
        //   type: 'listinput',
        //   name: 'shapeType',
        //   message: 'Select a shape for logo',
        //   choices: ['Circle','Triangle','Square'],
        // },
        // {
        //   type: 'input',
        //   name: 'shapeColor',
        //   message: 'Enter a shape color(a color keyword (OR a hexadecimal number)',
        //   //call colorValidCheck, validate if returns true 
        //   validate: this.colorValidCheck,
        // },
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
