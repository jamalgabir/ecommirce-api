const router = require('express').Router();
const User = require('../tables/User');
const CryptoJS = require('crypto-js');
const dotenv = require('dotenv').config();
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer")
//REGISTER ROUTER

router.post('/register', async (req,res) =>{
    const first = await req.body.firstname;
    const last =await req.body.lastname;
    const emai =await req.body.email;
    const pass =await req.body.password;
    
    if(!first||!last||!emai||!pass)return res.status(400).json({message:' mindatort to fill all !'});
    const oldUser = await User.findOne({email: emai});
    if(oldUser)return res.status(500).json({message:'This email Aready Registred!'});
        
    const newUser = new User({
       firstname:first,
       lastname: last,
       email:emai,
       password: CryptoJS.AES.encrypt(pass, process.env.PASS_SEC).toString()
    })
   try{
       const savedUser = await newUser.save();

       res.status(201).json({message:"successfully Registred"});
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Ops!! Something Wrong!!"})
    } 

    
    
});

router.post('/login', async (req,res) =>{
    try{
        
        const user = await User.findOne({email:req.body.email});
        !user && res.status(401).json({message:'Email or password is wrong!'});

        // const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        // const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        // originalPassword !== req.body.password && res.status(401).json({message:'wrong password!'});

        const accessToken = jwt.sign(
            {id:user._id, isAdmin:true},
            process.env.JWT_SEC,
            {expiresIn: '1d'}
        );
        res.cookie("access_token", accessToken,{
            httpOnly:true,
            secure: true,
            
        })
        const {password,...others} = user._doc;
        // res.cookie('token', accessToken,{
        //     maxAge:3000,
        //     expires: new Date('16 7 2022'),
        //     secure: true,
        //     httpOnly: true,
        //     sameSite:'lax'
        // });
        res.status(200).json({...others,accessToken});

    }catch(error){
        console.log(error)
        res.status(500).json({message:"Ops! something Wrong!!"})
    }

});
// Forgot-Password Router.
router.post("/forgot-password",async (req, res) =>{
    const {email} = req.body;
    try{
        let user = await User.findOne({email});
        if(!user){
            return res.status(500).json({message:"Email does not exist"})
        }
        const resetToken = crypto.randomBytes(20).toString("hex");
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: 'jamalismael58@gmail.com',
              pass: "cccb crxd nszn ravi",
            },
            tls: {
                rejectUnauthorized: false,
                
            }
          });
          const mailOptions = {
            from: 'jamalismael58@gmail.com',
            to: email,
            subject: 'Password Reset',
            text: `Click the following link to reset your password: http://localhost:5000/api/reset-password/${resetToken}`,
            
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return res.status(500).json("transferError" +error.toString());
            }
            res.status(200).json('Reset email sent: ' + info.response);
          });

    }catch(error){
        console.log(error)
    }
});

//ResetPassword Router.
router.post("/reset-password", async (req, res) =>{
    const { token } = req.params;
    const { password } = req.body;
    try{

  // Find the user with the provided reset token
  const user = await User.findOne({ token: token });

  if (!user) {
    return res.status(400).send({message:'Invalid or expired token'});
  }

  // Update the user's password and clear the reset token
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  user.password = hash;
  user.resetToken = undefined;
  await user.save();

  res.status(200).send({message:'Password reset successful'});
}catch(error){
    console.log(error)
}
});

module.exports = router;
