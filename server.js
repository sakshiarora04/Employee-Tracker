const db = require('./config/connection');
const express = require('express');
const inquirer = require('inquirer');
// Import and require mysql2

require('console.table');
const CLI = require('./lib/cli.js');
const cli = new CLI();
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

cli.run()
.then((res) => {
  switch (res.choices) {
    case 'Add Role':
        addRole();
        break;

    default:
        break;
}
return res.choices; 
})
 .catch((err) => {
   console.log(err);
   console.log('Oops. Something went wrong.');
 });


// View all departments
app.get('/api/department', (req, res) => {
  const sql = `SELECT id, department_name AS title FROM department`;
  
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
       return;
    }
    console.table("All Departments", rows);
    res.json({
      message: 'success',
      data: rows
    });
  });
});
//View all roles
app.get('/api/roles', (req, res) => {
  const sql = `SELECT role.id,role.title, department.department_name AS department,role.salary
  FROM role
  LEFT JOIN department
  ON role.department_id = department.id
  ORDER BY role.id`;
  
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
       return;
    }
    console.table("All roles",rows);
    res.json({
      message: 'success',
      data: rows
    });
  });
});
//View all employees
app.get('/api/employees', (req, res) => {
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
      res.status(500).json({ error: err.message });
       return;
    }
   
    console.table("All Employess", rows);
    res.json({
      message: 'success',
      data: rows
    });
  });
});
// Add department
app.post('/api/department', ({ body }, res) => {
  const sql = `INSERT INTO department (department_name)
    VALUES (?)`;
  const params = [body.department];
  
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
   
    res.json({
      message: 'success',
      data: body
    });
  });
});
//Add role
function addRole() {
  const sql = `SELECT department_name FROM department`;
  let departmentList=[];
  db.query(sql,(err, rows) => {
    if (err) {
      console.log(err.message);
       return;
    }
    departmentList=  rows.map((row)=>{
      return row['department_name']
    });    
     inquirer.prompt([
      { 
        type: 'input',
        name: 'role',
        message: 'What is name of role?' 
      },
      { 
        type: 'input',
        name: 'salary',
        message: 'What is salary?' 
      },
      { 
        type: 'list',
        name: 'departmentId',
        message: 'Select department',
        choices: departmentList,
      },    
  ]) 
  .then((body)=>{   
    
      const sql = `INSERT INTO role(title,salary,department_id)
      VALUES (?,?,(SELECT id FROM department WHERE department_name=?))`;
      const params = [body.role,body.salary,body.department]; 
      
      db.query(sql, params, (err, result) => {
        
        if (err) {
          console.log(err.message);          
          return;
        }      
        
        console.log(`Added ${params[0]} to database`)
      });
    });
  });

 
}
  app.post('/api/role', ({ body }, res) => {
    const sql = `INSERT INTO role(title,salary,department_id)
    VALUES (?,?,(SELECT id FROM department WHERE department_name=?))`;
    const params = [body.role,body.salary,body.department]; 
    
    db.query(sql, params, (err, result) => {
      
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
     
      res.json({
        message: 'success',
        data:body
      });
      console.log(`Added ${params[0]} to database`)
    });
  });
// Add employee
app.post('/api/employee', ({ body }, res) => {
  const sql = `INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES( ?,?,(SELECT role.id from role  WHERE role.title=?),(SELECT e.id from employee e WHERE CONCAT_WS(e.first_name," ",e.last_name)=? ))`;
  const params = [body.first_name,body.last_name,body.role,body.manager]; 
  
  db.query(sql, params, (err, result) => {
    
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
   
    res.json({
      message: 'success',
      data:body
    });
    console.log(`Added ${params[0]} ${params[1]} to database`)
  });
});
//View employees by manager
// app.get('/api/manager_id', (req, res) => {
//   const sql = `SELECT CONCAT("Kevin"," ","Tupik") As Manager, CONCAT(first_name," ",last_name) AS Employee,
//   FROM employee 
//   WHERE manager_id=(SELECT id FROM (SELECT * FROM employee) AS emp  WHERE emp.first_name="Kevin" and emp.last_name="Tupik")`;
  
//   db.query(sql, (err, rows) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//        return;
//     }
//     console.table("All roles",rows);
//     res.json({
//       message: 'success',
//       data: rows
//     });
//   });
// });


// // Delete a movie
// app.delete('/api/movie/:id', (req, res) => {
//   const sql = `DELETE FROM movies WHERE id = ?`;
//   const params = [req.params.id];
  
//   db.query(sql, params, (err, result) => {
//     if (err) {
//       res.statusMessage(400).json({ error: res.message });
//     } else if (!result.affectedRows) {
//       res.json({
//       message: 'Movie not found'
//       });
//     } else {
//       res.json({
//         message: 'deleted',
//         changes: result.affectedRows,
//         id: req.params.id
//       });
//     }
//   });
// });

// // Read list of all reviews and associated movie name using LEFT JOIN
// app.get('/api/movie-reviews', (req, res) => {
//   const sql = `SELECT movies.movie_name AS movie, reviews.review FROM reviews LEFT JOIN movies ON reviews.movie_id = movies.id ORDER BY movies.movie_name;`;
//   db.query(sql, (err, rows) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }
//     res.json({
//       message: 'success',
//       data: rows
//     });
//   });
// });

// // BONUS: Update review name
// app.put('/api/review/:id', (req, res) => {
//   const sql = `UPDATE reviews SET review = ? WHERE id = ?`;
//   const params = [req.body.review, req.params.id];

//   db.query(sql, params, (err, result) => {
//     if (err) {
//       res.status(400).json({ error: err.message });
//     } else if (!result.affectedRows) {
//       res.json({
//         message: 'Movie not found'
//       });
//     } else {
//       res.json({
//         message: 'success',
//         data: req.body,
//         changes: result.affectedRows
//       });
//     }
//   });
// });

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
