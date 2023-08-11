SELECT role.id,role.title, department.department_name AS department,role.salary
FROM role
LEFT JOIN department
ON role.department_id = department.id
ORDER BY role.id;

-- SELECT * from role;