const {router, bcrypt, db ,authenticateToken ,jsonwebtoken} =  require("./importModule");

router.post("/Salaries/register", async (req, res) => {
    try {
      const {SalaryID, EmployeeID, SalaryAmount} = req.body;
  
      const insertSalariesQuery =
        "INSERT INTO Salaries (SalaryID, EmployeeID, SalaryAmount) VALUES (?, ?, ?)";
      await db
        .promise()
        .execute(insertSalariesQuery, [SalaryID, EmployeeID, SalaryAmount]);
  
      res.status(201).json({ message: "Salaries registered successfully" });
    } catch (error) {
      console.error("Error registering Salaries:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

router.get('/Salaries/:id',authenticateToken, (req, res) => {
    let SalaryID = req.params.id;

    if (!SalaryID) {
        return res.status(400).send({error: true, message :'Please provide SalariesID'});
    }
    try{
        db.query('select id, SalaryID, EmployeeID, SalaryAmount FROM Salaries WHERE id = ?', SalaryID, (err, result) => {
          if(err){
            console.error('erroe fetching items:', err);
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


router.get('/Salaries',authenticateToken, (req, res) => {

    try {
        db.query('SELECT id, SalaryID, EmployeeID, SalaryAmount FROM Salaries',(err, result) => {

            if(err) {
                console.error('error fetching items:', err);
                req.status(500).json({ error: 'Internal Server Error' });
            }else{
                res.status(200).json({result});
            }
        });

    } catch (error) {
        console.error('Error loading Salaries', error);
        res.status(200).json({ error: 'Internal Server Error' });
    }
});



router.put('/Salaries/:id', authenticateToken, async (req,  res) => {
    let Salaries = req.params.id;

    const{SalaryID, EmployeeID, SalaryAmount} = req.body;

    if (!SalaryID || !EmployeeID || SalaryAmount) {
        return res.status(400).send({error: user,message:'please provide ADDRESS code'});
    } 

    try { 
        db.query('UPDATE Salaries SET SalaryID = ?, EmployeeID = ?, SalaryAmount = ?',[SalaryID, EmployeeID, SalaryAmount],(err,result, fields) => {
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


router.delete("/Salaries/:id", authenticateToken, (req, res) =>  {
    
    let SalaryID = req.params.id;

    if (!SalaryID) {
        return res.status(400).send({ error: true, message: 'please provide PositionID' });
    }
       try {
        db.query('DELETE FROM Salaries WHERE id = ?', SalaryID, (err, result, fields) => {

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

module.exports = router