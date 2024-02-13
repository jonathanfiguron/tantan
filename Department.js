const {router, bcrypt, db ,authenticateToken ,jsonwebtoken} =  require("./importModule");

router.post("/Department/register", async (req, res) => {
    try {
      const {DepartmentID, DepartmentName} = req.body;
  
      const insertDepartmentQuery =
        "INSERT INTO Department (DepartmentID, DepartmentName) VALUES (?, ?)";
      await db
        .promise()
        .execute(insertDepartmentQuery, [DepartmentID, DepartmentName]);
  
      res.status(201).json({ message: "Department registered successfully" });
    } catch (error) {
      console.error("Error registering Department:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

router.get('/Department/:id',authenticateToken, (req, res) => {
    let DepartmentID = req.params.id;

    if (!DepartmentID) {
        return res.status(400).send({error: true, message :'Please provide DepartmentID'});
    }
    try{
        db.query('select id, DepartmentID, DepartmentName FROM Department WHERE id = ?', DepartmentID, (err, result) => {
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


router.get('/Department',authenticateToken, (req, res) => {

    try {
        db.query('SELECT id, DepartmentID, DepartmentName FROM Department',(err, result) => {

            if(err) {
                console.error('error fetching items:', err);
                req.status(500).json({ error: 'Internal Server Error' });
            }else{
                res.status(200).json({result});
            }
        });

    } catch (error) {
        console.error('Error loading Department', error);
        res.status(200).json({ error: 'Internal Server Error' });
    }
});



router.put('/Department/:id', authenticateToken, async (req,  res) => {
    let EmployeeID = req.params.id;

    const{DepartmentID, DepartmentName} = req.body;

    if (!DepartmentID || !DepartmentName) {
        return res.status(400).send({error: user,message:'please provide ADDRESS code'});
    } 

    try { 
        db.query('UPDATE Department SET DepartmentID = ?, DepartmentName = ?',[DepartmentID, DepartmentName],(err,result, fields) => {
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


router.delete("/Department/:id", authenticateToken, (req, res) =>  {
    
    let employeesID = req.params.id;

    if (!DepartmentID) {
        return res.status(400).send({ error: true, message: 'please provide DepartmentID' });
    }
       try {
        db.query('DELETE FROM Department WHERE id = ?', DepartmentID, (err, result, fields) => {

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