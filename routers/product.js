const User = require('../tables/User');
const cookie = require('cookie');
const {verifyTokenAndAdmin,verifyToken } = require('./verifyToken');

const router = require('express').Router();
const Product = require('../tables/Product');
const { authorization } = require('./verifyToken2');

//UPDATE PRODUCT
router.put('/:id',verifyTokenAndAdmin, async (req,res) =>{
    
    try{

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,{
            $set: req.body
        },
        {
            new: true
        }
        );
        res.status(200).json(updatedProduct);
    }
    catch(err){
        res.status(500).json(err)
    }

});

// //DELET PRODUCT BY ID
router.delete('/:id', verifyTokenAndAdmin, async (req, res) =>{
    try{
       await Product.findByIdAndDelete(req.params.id)
       res.status(200).json('the product has ben deleted!');
    }catch(err){
        res.status(500).json("you cant do that my you are not the admin")
    }
});
// GET PRODUCT by id
router.get('/find/:id', async (req, res) =>{
    try{
      const product = await Product.findById(req.params.id);
      
       res.status(200).json({product})
    }catch(err){
        res.status(500).json("some error in the get products")
    }
});

//GET ALL PRODUCTS
router.get('/', async (req, res) =>{
    const qnew = req.query.new;
    const qcategory = req.query.category;

    // let headercookie = req.headers.cookie;
    // if(typeof headercookie !== 'string'){
    //     headercookie = '';
    //     console.log(headercookie)
    // }
    // const cookie2 = cookie.parse(headercookie);
 
    //const bearer = cookie2;
    //console.log(cookie2)
    try{
      let products;
      if(qnew){
          products = await Product.find().sort({createdAt: -1}).limit(1);
      }else if(qcategory){
          products = await Product.find({
              categories: {
                  $in: [qcategory],
              }
          });
      }else{
          products = await Product.find();
      }
      
       res.status(200).json(products);
    }catch(err){
        res.status(500).json(err);
    }
});

// CREATE PRODUCT
router.post('/',verifyTokenAndAdmin, async (req, res) =>{
    
    const newProduct = new Product(req.body)
   
    try{
        const savedProduct = await newProduct.save();
        res.status(200).json({newProduct});

    }catch(Error){
        res.status(500).json("there is some error please try agin")
    }

})





module.exports = router;