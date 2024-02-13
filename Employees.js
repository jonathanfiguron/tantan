const express = require("express");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const app = express();

const cors = require("cors");
app.use(cors());
const PORT = process.env.PORT || 4438;

const secretKey = "figuron-secret-key";



app.use(bodyParser.json());

app.use(bodyParser.json());
const {router, bcrypt, db ,authenticateToken ,jsonwebtoken} =  require("./importModule");

router.post("/Employees/register", async (req, res) => {
    try {
      const { EmployeeID, FirstName, LastName, Email, Phone, DepartmentID, PositionID } = req.body;
  
      const inserEmployeesQuery =
        "INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, DepartmentID, PositionID) VALUES (?, ?, ?, ?, ?, ?, ?)";
      await db
        .promise()
        .execute(insertEmployeesQuery, [EmployeeID, FirstName, LastName, Email, Phone, DepartmentID, PositionID]);
  
      res.status(201).json({ message: "employee registered successfully" });
    } catch (error) {
      console.error("Error registering employee:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

router.get('/Employees/:id',authenticateToken, (req, res) => {
    let EmployeeID = req.params.id;

    if (!EmployeeID) {
        return res.status(400).send({error: true, message :'Please provide EmployeeID'});
    }
    try{
        db.query('select id, EmployeeID, FirstName, LastName, Email, Phone, DepartmentID, PositionID WHERE id = ?', EmployeeID, (err, result) => {
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


router.get('/Employees',authenticateToken, (req, res) => {

    try {
        db.query('SELECT select id, EmployeeID, FirstName, LastName, Email, Phone, DepartmentID, PositionID FROM Employees',(err, result) => {

            if(err) {
                console.error('error fetching items:', err);
                req.status(500).json({ error: 'Internal Server Error' });
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

    if (!EmployeeID || !role_code || !role_name) {
        return res.status(400).send({error: user,message:'please provide role code and role name'});
    } 

    try { 
        db.query('UPDATE Employees SET FirstName = ?, LastName = ?, Email = ?, Phone = ?, DepartmentID = ?, PositionID = ?',[FirstName, LastName, Email, Phone, DepartmentID, PositionID],(err,result, fields) => {
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


router.delete("/Employees/:id", authenticateToken, (req, res) =>  {
    
    let EmployeeID = req.params.id;

    if (!EmployeeID) {
        return res.status(400).send({ error: true, message: 'please provide EmployeeID' });
    }
       try {
        db.query('DELETE FROM Employees WHERE id = ?', EmployeeID, (err, result, fields) => {

            if (err) {
                console.error('error deleting items', err);
                res.status(500).json({message: 'inetrnal server error'});
            } else {
                res.status(200).json(result);
        }
    });

       }catch (error){
        console.error('error loadng user:', error);
        res.status(500).json({error: ' internal serever error'});
       }
});

app.get("/", (req, res) => {
    res.json({ message: "Restful API Backend Using ExpressJS" });
  });
  app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  });

module.exports = router