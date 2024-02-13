const {router, bcrypt, db ,authenticateToken ,jsonwebtoken} =  require("./importModule");

router.post("/Positions/register", async (req, res) => {
    try {
      const {PositionID, PositionName} = req.body;
  
      const insertPositionsQuery =
        "INSERT INTO Positions (PositionID, PositionName) VALUES (?, ?)";
      await db
        .promise()
        .execute(insertPositionsQuery, [PositionID, PositionName]);
  
      res.status(201).json({ message: "Positions registered successfully" });
    } catch (error) {
      console.error("Error registering Positions:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

router.get('/Positions/:id',authenticateToken, (req, res) => {
    let PositionID = req.params.id;

    if (!PositionID) {
        return res.status(400).send({error: true, message :'Please provide PositionsID'});
    }
    try{
        db.query('select id, PositionID, PositionName FROM Positions WHERE id = ?', PositionID, (err, result) => {
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


router.get('/Positions',authenticateToken, (req, res) => {

    try {
        db.query('SELECT id, PositionID, PositionName FROM Positions',(err, result) => {

            if(err) {
                console.error('error fetching items:', err);
                req.status(500).json({ error: 'Internal Server Error' });
            }else{
                res.status(200).json({result});
            }
        });

    } catch (error) {
        console.error('Error loading Positions', error);
        res.status(200).json({ error: 'Internal Server Error' });
    }
});



router.put('/Positions/:id', authenticateToken, async (req,  res) => {
    let EmployeeID = req.params.id;

    const{PositionID, PositionName} = req.body;

    if (!PositionID || !PositionName) {
        return res.status(400).send({error: user,message:'please provide ADDRESS code'});
    } 

    try { 
        db.query('UPDATE Positions SET PositionID = ?, PositionName = ?',[PositionID, PositionName],(err,result, fields) => {
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


router.delete("/Positions/:id", authenticateToken, (req, res) =>  {
    
    let employeeID = req.params.id;

    if (!PositionID) {
        return res.status(400).send({ error: true, message: 'please provide PositionID' });
    }
       try {
        db.query('DELETE FROM Positions WHERE id = ?', PositionID, (err, result, fields) => {

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