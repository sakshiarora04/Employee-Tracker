-- SELECT * from department;

-- SELECT role.id,role.title, department.department_name AS department,role.salary
-- FROM role
-- LEFT JOIN department
-- ON role.department_id = department.id
-- ORDER BY role.id;

-- SELECT e.id, e.first_name, e.last_name, r.title, d.department_name AS department, r.salary, CONCAT(m.first_name," ",m.last_name) As manager
-- FROM employee e
-- LEFT JOIN role r
-- ON e.role_id= r.id
-- LEFT JOIN department d
-- ON r.department_id= d.id
-- LEFT JOIN employee m
-- ON e.manager_id= m.id;

-- Add department---"Added service to the database"
-- INSERT INTO department(department_name)
-- VALUES ("Service")

-- Add role-- select from department name options-"Added customer service to database"
-- INSERT INTO role(title,salary,department_id)
-- VALUES ("Customer Service",80000,(SELECT department.id FROM department WHERE department_name="Service") )
--
-- Add Employee-Added Sakshi Arora into database
--  INSERT INTO employee (first_name,last_name,role_id,manager_id)
--  VALUES( "Sa","Arora",(SELECT role.id from role  WHERE role.title="Sales Lead"),(SELECT e.id from employee e WHERE e.first_name="Malia" and e.last_name="Brown"));

-- Update employee role-Updated employee role
-- UPDATE employee
-- SET role_id=(SELECT id FROM role WHERE title="Lawyer")
-- WHERE first_name="John" and last_name="Doe";

-- Update employee managers
-- Update employee 
-- SET manager_id=(SELECT id FROM (SELECT * FROM employee) AS emp  WHERE emp.first_name="Kevin" and emp.last_name="Tupik")
-- WHERE first_name="Sa" and last_name="Arora";


-- View employees by manager
-- SELECT CONCAT("Kevin"," ","Tupik") As Manager, CONCAT(first_name," ",last_name) AS Employee
--  FROM employee 
--  WHERE manager_id=(SELECT id FROM (SELECT * FROM employee) AS emp  WHERE emp.first_name="Kevin" and emp.last_name="Tupik");

-- View employees by department
-- SELECT e.id,CONCAT(e.first_name," ",e.last_name) AS Employees, r.title FROM employee e
-- JOIN role r
-- ON e.role_id=r.id
-- JOIN department d   
-- ON r.department_id=d.id
-- WHERE d.department_name="Engineering"
-- ORDER BY e.first_name;

-- delete departments, roles,employees
-- DELETE FROM department WHERE department_name="Service";
-- DELETE FROM role WHERE title="Customer Service";
-- DELETE FROM employee WHERE first_name="Sa" AND last_name="Arora";

-- View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.
-- SELECT d.department_name AS Department, SUM(r.salary) AS Total_Salaries FROM employee e
-- JOIN role r
-- ON e.role_id=r.id
-- JOIN department d   
-- ON r.department_id=d.id
-- WHERE d.department_name="Sales";


