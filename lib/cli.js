const inquirer = require('inquirer'); // inquirer library
const { join } = require('path');  // path library to join file path
const { writeFile } = require('fs/promises'); // file system library

class CLI {  
  run() {
    // inquirer prompt questions related to logo name, color and shape
    return inquirer
      .prompt([
        {
          type: 'input',
          name: 'text',
          message: 'Enter the text for logo (Enter upto three characters)',
          //call checkTextSize, validate if returns true 
          validate:this.checkTextSize,
        },
        {
          type: 'input',
          name: 'textColor',
          message: 'Enter a text color(a color keyword (OR a hexadecimal number)',
          //call colorValidCheck, validate if returns true 
          validate: this.colorValidCheck,
        },
        {
          type: 'list',
          name: 'shapeType',
          message: 'Select a shape for logo',
          choices: ['Circle','Triangle','Square'],
        },
        {
          type: 'input',
          name: 'shapeColor',
          message: 'Enter a shape color(a color keyword (OR a hexadecimal number)',
          //call colorValidCheck, validate if returns true 
          validate: this.colorValidCheck,
        },
      ])
    //   .then(({text,textColor,shapeType,shapeColor }) => {
    //     let shapeObj;  
    //     // instantiate class and set color according to shape selected from list   
    //   switch (shapeType){
    //     case 'Circle':          
    //       shapeObj=new Circle();
    //       shapeObj.setColor(shapeColor);         
    //       break;
    //       case 'Triangle':          
    //       shapeObj=new Triangle();     
    //       shapeObj.setColor(shapeColor);
    //       break;
    //       case 'Square':          
    //       shapeObj=new Square(); 
    //       shapeObj.setColor(shapeColor);   
    //       break;
    //   }          
    //   const svgLogo=new SVG();    
    //   //run setText method to create text tag
    //   svgLogo.setText(text,textColor);   
    //   //run setShape to create shape tag    
    //   svgLogo.setShape(shapeObj);
    //   //write file to output folder passing generated SVG html by render function as argument
    //     return writeFile(join(__dirname, '..', 'output', 'logo.svg'),svgLogo.render());
    // })         
  
    //   .then(() => console.log('Generated logo.svg'))
      .catch((err) => {
        console.log(err);
        console.log('Oops. Something went wrong.');
      });
  }
colorValidCheck(input){    
    const color=input.toLowerCase();
    const colorKeywords = ['aliceblue', 'antiquewhite', 'aqua', 'aquaMarine', 'azure', 'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgrey', 'darkgreen', 'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray', 'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'grey', 'green', 'greenyellow', 'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgrey', 'lightgreen', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple', 'rebeccapurple', 'red', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow', 'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen']
    // filter out matching keyword in array, retuns empty array if it finds no matching word
    const newArray=colorKeywords.filter(word => word===color);  
    // check hexadecimal -6 digit starting # 
    const hexDecRegex = '^#[A-Fa-f0-9]{6}$';
    //if doesnt match keyword or hexadecimal criteria then return message
    if ( !newArray.length&& !input.match(hexDecRegex) ) {
     return 'Please enter valid color';
   }
   return true;    
  }
  // check logo name length
  checkTextSize(input){
    if(input.length>3){
      return 'Logo text must contain less than or equal to 3 characters';
    }
    return true;
   }
}

module.exports = CLI;
