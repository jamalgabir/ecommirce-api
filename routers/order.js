
const {verifyTokenAndAdmin, verifyToken, verifyTokenAndAuthorization } = require('./verifyToken');

const router = require('express').Router();
const Order = require('../tables/Order');

//UPDATE ORDER
router.put('/:id',verifyTokenAndAdmin, async (req,res) =>{
    
    try{
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id,
            {$set: req.body},
            {new: true}
        );
        res.status(200).json(updatedOrder);
    }
    catch(err){
        res.status(500).json(err)
    }

});

// // //DELET PRODUCT BY ID
router.delete('/:id', verifyTokenAndAdmin, async (req, res) =>{
    try{
       await Order.findByIdAndDelete(req.params.id)
       res.status(200).json('the Order has ben deleted!...');
    }catch(err){
        res.status(500).json("you cant do that my you are not the admin")
    }
});
// GET USER Order by id
router.get('/:userId', verifyTokenAndAdmin, async (req, res) =>{
    try{
      const order = await Order.find({userId: req.params.userId});
      
      res.status(200).json({order});
    }catch(err){
        res.status(500).json("some error in the get Orders")
    }
});

// //GET ALL Order
router.get('/',verifyTokenAndAdmin, async (req, res) =>{
    
    try{
        const allOrder = await Order.find();
        res.status(200).json(allOrder)

    }catch(error){
        res.status(500).json(error);
    }
});

// CREATE ORDER

router.post('/',verifyTokenAndAdmin, async (req, res) =>{
    
    const newOrder = new Order(req.body);
   
    try{
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);

    }catch(Error){
        res.status(500).json(Error);
    }

});

//GET MONTHLY INCOME

router.get('/admin/income', verifyTokenAndAdmin, async (req, res) =>{
    //NEED FIX THE QUERY PATH
    const productId = req.query.pid;
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() -1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() -1));
    
    try{
        
        const income = await Order.aggregate([
            {
                $match: {
                createdAt: {
                    $gte: previousMonth
                },
                ...(productId && {
                    products: {elemMatch: {productId}},
                }),
              },
           },
            {
                $project: {

                    month: { 
                        $month: "$createdAt"
                    },

                    sales: "$amount",
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: {
                       $sum: "$sales"
                    }
                }
            }
            
        
            
        ]);
        
        res.status(200).json(income);
        
    }catch(error){
        res.status(500).json(error);
    };
});





module.exports = router;