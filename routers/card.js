const User = require('../tables/User');
const {verifyTokenAndAdmin, verifyToken, verifyTokenAndAuthorization } = require('./verifyToken');

const router = require('express').Router();
const Card = require('../tables/Card');

//UPDATE CARD
router.put('/:id',verifyTokenAndAuthorization, async (req,res) =>{
    
    try{
        const updatedCard = await Card.findByIdAndUpdate(req.params.id,
            {$set: req.body},
            {new: true}
        );
        res.status(200).json(updatedCard);
    }
    catch(err){
        res.status(500).json(err)
    }

});

// // //DELET CARD BY ID
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) =>{
    try{
       await Card.findByIdAndDelete(req.params.id)
       res.status(200).json('the Card has ben deleted!...');
    }catch(err){
        res.status(500).json("you cant do that my you are not the admin")
    }
});
// GET USER Card by id
router.get('/:userId', verifyTokenAndAuthorization, async (req, res) =>{
    try{
      const card = await Card.findOne({userId: req.params.userId});
      
       res.status(200).json({card})
    }catch(err){
        res.status(500).json("some error in the get Cards")
    }
});

// //GET ALL Card
router.get('/',verifyTokenAndAdmin, async (req, res) =>{
    
    try{
        const allcard = await Card.find();
        res.status(200).json(allcard)

    }catch(error){
        res.status(500).json(error);
    }
});

// CREATE PRODUCT

router.post('/',verifyToken, async (req, res) =>{
    
    const newCard = new Card(req.body)
   
    try{
        const savedCard = await newCard.save();
        res.status(200).json({newCard});

    }catch(Error){
        res.status(500).json("there is some error please try agin")
    }

})





module.exports = router;