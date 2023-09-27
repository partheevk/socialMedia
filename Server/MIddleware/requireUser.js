const jwt=require('jsonwebtoken');
const { error } = require('../utils/responseWrapper');
const User = require('../Models/user');

module.exports=async (req,res,next)=>{
    if(!req.headers || !req.headers.authorization || !req.headers.authorization.startsWith('Bearer')){
        return res.status(401).send('auth header required');
    }
    const accessToken=req.headers.authorization.split(" ")[1];

    try {
        const decoded=jwt.verify(accessToken,process.env.ACCESS_TOKEN_PRIVATE_KEY);
        req._id=decoded._id;

        const user=await User.findById(req._id);

        if(!user){
            return res.send(error(404,'user not found'));
        }

        next();
    } catch (e) {
        
        // return res.status(401).send('invalid access key');
        return res.send(error(401,'invalid access key'));
    }


    
}