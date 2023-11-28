const jwt = require("jsonwebtoken");


const authorization = (req,res,next) =>{
    const token = req.cookies.access_token;
    console.log("THE TOKEN "+token)
    if(!token){
        return res.status(401).json({message:'you are not authorization '})
    }

    try{
        const data = jwt.verify(token, process.env.JWT_SEC)
        return next();
    }catch(error){
        console.log("THE ERROR "+ error)
        return res.status(401).json({message:"you token invalid!"})
    }
};

module.exports ={ authorization}