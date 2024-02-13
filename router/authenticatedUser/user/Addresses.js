const {router, bcrypt, db ,authenticateToken ,jsonwebtoken} =  require("../../../importModule");

router.post("/addresses/register", async (req, res) => {
    try {
      const { AddressID, EmployeeID, AddressLine1, City } = req.body;
  
      const insertAddressesQuery =
        "INSERT INTO Addresses (AddressID, EmployeeID, AddressLine1, City) VALUES (?, ?, ?, ?)";
      await db
        .promise()
        .execute(insertaddressesQuery, [AddressID, AddressID, AddressLine1, City]);
  
      res.status(201).json({ message: "addresses registered successfully" });
    } catch (error) {
      console.error("Error registering addresses:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

router.get('/addresses/:id',authenticateToken, (req, res) => {
    let AddressID = req.params.id;

    if (!AddressID) {
        return res.status(400).send({error: true, message :'Please provide indicator_ID'});
    }
    try{
        db.query('select id, AddressID, EmployeeID, AddressLine1, City FROM Addresses WHERE id = ?', AddressID, (err, result) => {
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


router.get('/addresses',authenticateToken, (req, res) => {

    try {
        db.query('SELECT id, AddressID, EmployeeID, AddressLine1, City FROM Addresses',(err, result) => {

            if(err) {
                console.error('error fetching items:', err);
                req.status(500).json({ error: 'Internal Server Error' });
            }else{
                res.status(200).json({result});
            }
        });

    } catch (error) {
        console.error('Error loading addresses', error);
        res.status(200).json({ error: 'Internal Server Error' });
    }
});



router.put('/addresses/:id', authenticateToken, async (req,  res) => {
    let employeesID = req.params.id;

    const{EmployeeID, AddressLine1, City} = req.body;

    if (!EmployeeID || !AddressLine1 || !City) {
        return res.status(400).send({error: user,message:'please provide ADDRESS code'});
    } 

    try { 
        db.query('UPDATE Addresses SET AddressID = ?, EmployeeID = ?, AddressLine1 = ?, City = ?  WHERE id = ?',[description, user_id, evaluation_id, indicator_id],(err,result, fields) => {
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


router.delete("/addresses/:id", authenticateToken, (req, res) =>  {
    
    let AddressID = req.params.id;

    if (!AddressID) {
        return res.status(400).send({ error: true, message: 'please provide AddressID' });
    }
       try {
        db.query('DELETE FROM Addresses WHERE id = ?', AddressID, (err, result, fields) => {

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