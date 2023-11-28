
const jwt = require('jsonwebtoken');
//About Token
const verifyToken = (req,res, next) =>{
    const authoHeader = req.headers.token;
    
    //const authoHeder2 = req.heders.Bearer;
    if(authoHeader){
        const token = authoHeader.split(" ")[1];
        
        jwt.verify(token,process.env.JWT_SEC,(err,user)=>{
            if(err) res.status(403).json({message:"token is not valite"});
            req.user = user;
            next();
        })
    }
    else{
        return res.status(401).json({message:"you are not authonticated!"});


    }
};

//About verifyToken And Authorizations;

const verifyTokenAndAuthorization = (req,res,next)=>{

    verifyToken(req,res, ()=>{

        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        }else{
            res.status(403).json({message:"you are not allowed to change!"})
        }
    })
};

const verifyTokenAndAdmin = (req,res,next)=>{
    verifyToken(req,res, ()=>{
        if(req.user.isAdmin){
            next();
        }else{
            res.status(403).json("you are not the admin.!")
        }
    })
}
module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin};