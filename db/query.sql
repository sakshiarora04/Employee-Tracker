SELECT * from department;

SELECT role.id,role.title, department.department_name AS department,role.salary
FROM role
LEFT JOIN department
ON role.department_id = department.id
ORDER BY role.id;

SELECT e.id, e.first_name, e.last_name, r.title, d.department_name AS department, r.salary, CONCAT(m.first_name," ",m.last_name) As manager
FROM employee e
LEFT JOIN role r
ON e.role_id= r.id
LEFT JOIN department d
ON r.department_id= d.id
LEFT JOIN employee m
ON e.manager_id= m.id;