const User = require('../tables/User');
const {verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const router = require('express').Router();

//UPDATE USER
router.put('/user/:id',verifyTokenAndAuthorization, async (req,res) =>{
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString();
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set: req.body
        },
        {
            new: true
        }
        );
        res.status(200).json(updatedUser);
    }
    catch(err){
        res.status(500).json(err)
    }

});

//DELET USER
router.delete('/user/:id', verifyTokenAndAuthorization, async (req, res) =>{
    try{
       await User.findByIdAndDelete(req.params.id)
       res.status(200).json('the user has ben deleted!')
    }catch(err){
        res.status(500).json(err)
    }
});
//GET USER
router.get('/user/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      //const user_token = user.createResetToken(); // Make sure this method is defined properly
      const { password, ...others } = user._doc;
  
      res.status(200).json(others);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

//GET ALL THE USERS
router.get('/users', verifyTokenAndAdmin, async (req, res) =>{
    const query = req.query.new;
    try{
      const users = query
      ? await User.find().sort({_id: -1}).limit(1)
      : await User.find();
      
       res.status(200).json(users);
    }catch(err){
        res.status(500).json(err);
    }
});

//GET USER STATUS 
router.get('/users/status',verifyTokenAndAdmin,async (req,res) =>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() -1));

    try{
        const data = await User.aggregate([
            {$match: {createdAt: {$gte: lastYear}}},
            {
                $project: {
                    month: {$month: '$createdAt'}
                }
            },
            {
                $group: {
                    _id: '$month',
                    totale: {$sum: 1}
                }
            }
        ]);
        res.status(200).json({data})
    }catch(error){
        res.status(500).json(error)
    }
})
//////////////////////////////////////////

// Generate a random token
function generateToken() {
    return crypto.randomBytes(64).toString('hex');
}
  
// Send a password reset email
const sendPasswordResetEmail = (email, token) =>{
    // Use nodemailer to send the email
    const transporter = nodemailer.createTransport({
      
      host: 'smtp.zoho.com',
      port:'465',
      secure: true,
      auth: {
        user: 'jamalismael58@gmail.com',
        pass: 'Gabir1990'
      },
      tls: {
        ciphers: 'AES128-GCM-SHA256'
      }
      
        
    });
  
    const mailOptions = {
      from: 'jamalismael58@gmail.com',
      to: email,
      subject: 'Password Reset',
      text: `Click the link to reset your password: http://localhost:5000/api/user/reset-password?token=${token}`
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error from transport", error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
}
  
// Request a password reset
router.post('/user/request-reset',async (req, res) =>{
    const email = req.body.email;
    const token = generateToken();
  
// Save the token and email to the database
   try{
     const user = await User.findOne({email:email});
     if(!user) return 
    res.status(500).json("this email is not fund !");
    const updatedUser = await User.findByIdAndUpdate(user._id,{
        $set: {token:token}
    },
    {
        new: true
    }
    );

    if (!updatedUser) 
       return res.status(500).json('Error saving token to database');
        
       sendPasswordResetEmail(email, token)
       console.log('Password reset email sent');
     }catch(error){
     console.log( "Error from catch",error)
   }
    
});
  
// Reset the password
router.post('/reset-password', (req, res) => {
    const token = req.body.token;
    const password = req.body.password;
  
    // Check the token and email in the database
    db.getEmailFromToken(token, function(err, email) {
      if (err) {
        res.status(500).json('Error getting email from database');
      }
      //save new password
    })
})
module.exports = router;
