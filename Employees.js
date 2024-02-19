// const express = require("express");
// // const mysql = require("mysql2");
// // const jwt = require("jsonwebtoken");
// // const bcrypt = require("bcrypt");
// const bodyParser = require("body-parser");
// const app = express();

// const cors = require("cors");
// app.use(cors());
// const PORT = process.env.PORT || 4438;

// const secretKey = "figuron-secret-key";

 
 
// app.use(bodyParser.json());

// app.use(bodyParser.json());
const {router, bcrypt, db ,authenticateToken ,jsonwebtoken} =  require("./importModule");

router.post("/Employees/register", async (req, res) => {
    try {
      const {EmployeeID, FirstName, LastName, Email, Phone, DepartmentID, PositionID } = req.body;
  
      const inserEmployeesQuery =
        "INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, DepartmentID, PositionID) VALUES (?, ?, ?, ?, ?, ?, ?)";
      await db
        .promise()
        .execute(inserEmployeesQuery, [EmployeeID, FirstName, LastName, Email, Phone, DepartmentID, PositionID]);
  
      res.status(201).json({ message: "employee registered successfully" });
    } catch (error) {
      console.error("Error registering employee:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  
  router.post("/login", async (req, res) => {
    try {
      const { Email} = req.body;
      const getUserQuery = "SELECT * FROM Employees WHERE Email = ?";
      const [rows] = await db.promise().execute(getUserQuery, [Email]);
    //   if (rows.length === 0) {
    //     return res.status(401).json({ error: "Invalid username" });
    //   }
    //   const user = rows[0];
    //   let passwordMatch = false;
     
    //   if (user.password.startsWith("$2b$") || user.password.startsWith("$2a$")) {
    //     passwordMatch = await bcrypt.compare(password, user.password);
    //   } else {
    //     passwordMatch = (password === user.password);
    //   }
    //   if (!passwordMatch) {
    //     return res.status(401).json({ error: "Invalid username or password" });
    //   }
      const token = jsonwebtoken.sign(
        { 
        
            FirstName: rows[0].FirstName, 
            LastName : rows[0].LastName, 
            Email : rows[0].Email, 
            Phone: rows[0].Phone, 
            DepartmentID:rows[0].DepartmentID, 
            PositionID:rows[0].PositionID
        
        },
        process.env.SECRETKEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({ token });
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }); 

router.get('/Employees/:id',authenticateToken, (req, res) => {
    let EmployeeID = req.params.id;

    if (!EmployeeID) {
        return res.status(400).send({error: true, message :'Please provide EmployeeID'});
    }
    try{
        db.query('SELECT * FROM Employees WHERE EmployeeID = ?', EmployeeID, (err, result) => {
          if(err){
            console.error('error fetching items:', err);
            res.status(500).json({ message: 'Internal server error'})
          } else {
            res.status(200).json(result);
          }  
        });

    } catch (errror){

        console.error('Error loadng user:', error);
        res.status(500).json({error: 'interrnal server error'})
    }
});


router.get('/Employees', authenticateToken,(req, res) => {

    try {
        db.query('SELECT * FROM Employees',(err, result) => {

            if(err) {
                console.error('error fetching items:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            }else{
                res.status(200).json({result});
            }
        });

    } catch (error) {
        console.error('Error loading users', error);
        res.status(200).json({ error: 'Internal Server Error' });
    }
});



router.put('/Employees/:id', authenticateToken, async (req,  res) => {
    let EmployeeID = req.params.id;

    const{FirstName, LastName, Email, Phone, DepartmentID, PositionID} = req.body;

    if (!FirstName || !LastName || !Email || !Phone || !DepartmentID || !PositionID) {
        return res.status(400).send({message:'please provide role code and role name'});
    } 

    try { 
        db.query('UPDATE Employees SET FirstName = ?, LastName = ?, Email = ?, Phone = ? WHERE EmployeeID = ? ',[FirstName, LastName, Email, Phone, DepartmentID, PositionID, EmployeeID],(err,result, fields) => {
        if (err){
            console.error('error updating:', err);
            res.status(500).json({message:'internall server error'});
        }else {
            res.status(200).json(result);
        }
    });

    } catch (error) {
        console.error('error loading user', error);
        res.status(500).json({ error: 'internnal server error' });
    }

});


router.delete("/Employees/:id", authenticateToken, (req, res) => {
  try {
    const employeeID = req.params.id;

    if (!employeeID) {
      return res.status(400).json({ error: true, message: 'Please provide EmployeeID' });
    }

    db.query('DELETE FROM Employees WHERE EmployeeID = ?', [employeeID], (err, result) => {
      if (err) {
        console.error('Error deleting employee:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      res.status(200).json({ message: 'Employee deleted successfully' });
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router