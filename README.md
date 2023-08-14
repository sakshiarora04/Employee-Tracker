# Employee-Tracker
## Description

Employee Tracker is command line application for managing employees data using node.js, inquirer and mysql. It uses sql to view, add, update and delete employees data in database. Node.js uses user input from inquirer to display results of searched query in table form.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contribution](#contribution)
- [Credits](#credits)
- [Technologies](#technologies) 
- [Contact Information](#contact-information) 


## Installation

To run locally on command line
1. Clone the Repository from GitHub
   ```
   git clone git@github.com:sakshiarora04/Employee-Tracker.git
   ```
2. Install Node.js then Open terminal and run command
   ```
   npm init
   ```
3. Install required dependencies given in package.json:

   ```
    "boxen": "4.0",
    "cfonts": "^3.2.0",
    "chalk": "^4.1.0",
    "console.table": "^0.10.0",
    "dotenv": "^8.2.0",
    "inquirer": "^8.2.4",
    "jshint": "^2.12.0",
    "mysql2": "^2.2.5"

   ```
4. In the end, run command-
   ```
   node index.js

   ```


## Usage

* When user runs command-line application, screen displays list of options- view all departments, view all roles, view all employees,view employees by manager or department, view budget of department, add a department, add a role, add an employee, update an employee role, delete department, delete role and delete employee.
* When user choose to view all departments then it displays a formatted table showing department names and department ids
* When we choose to view all roles then we get the job title, role id, the department that role belongs to, and the salary for that role in table form.
* On choosing view all employees, employees data contaning including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to, gets displayed.
* To add department, role or employee, choose corresponding options which are add a department, add a role and add an employee.
* After selecting any add option, user is prompted with questions related to selected option. For add a department, user need to enter the name of the department. On selecting add a role, user is prompted to enter the name, salary, and department for the role and that role will be added to the database. On selecting add a employee, questions will be asked to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
* When user choose to update an employee role then gets prompted to select an employee to update and their new role and this information will be updated in the database.
* When user choose to update an employee manager then gets prompted to select an employee to update and their new manager and this information will be updated in the database.
* When user select view employees by department, then present with list of departments to select. A formatted table of employee id, name and role is shown.
* When user select view employees by manager, then presented with list of employees of selected manager.
* There is options to delete department, role and an employee after selecting from corresponding list of departments, roles and employees.

Link to walkthrough video in google drive:

https://drive.google.com/file/d/1yyaZrQlolHDVyj4ow6TBGV19qsyQ5xX6/view

Link to walkthrough video in Screencastify:

https://app.screencastify.com/manage/videos/5Lq38XcMqhazdMrvupHt

The following images show the web application's appearance and functionality:

* Overview- working of all options

    ![Homepage.](./assets/images/overview.gif)

* Run application by running command npm start. 

    List of options to choose

    ![Select options.](./assets/images/select%20options.gif)

* Quit application

    ![Quit Application.](./assets/images/Quit.gif)

## Contribution

To contribute to this application, email me at sakshiarora245@gmail.com.
Here are the steps needed for doing that:

- Fork the repo
- Create a feature branch (git checkout -b NAME-HERE)
- Add stages (git add .)
- Commit your new feature (git commit -m 'Add some feature')
- Push your branch (git push)
- Create a new Pull Request

After reviewing, your feature branch will be merged.

## Credits

References:

https://npm.io/package/cfonts

https://developer.okta.com/blog/2019/06/18/command-line-app-with-nodejs

## Technologies

- node.js
- mysql
- npm packages- inquirer, boxen, cfonts, chalk
- console.table

## Contact Information

Github Username: [sakshiarora04](https://github.com/sakshiarora04)

Email id: sakshiarora245@gmail.com


