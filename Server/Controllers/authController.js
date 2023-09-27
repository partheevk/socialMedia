const User=require('../Models/user')
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const { error, success } = require('../utils/responseWrapper');

const signupController=async(req,res)=>{
    try {
        const {email,password,name}=req.body;

        if(!email || !password || !name){
            //return res.status(400).send('fields required')
            return res.send(error(400,'all fields are required'));
        }

        const oldUser=await User.findOne({email});
        if(oldUser){
           return res.send(error(409,'already signed'))
           // return res.status(409).send('already signedup')
        }
        
        const hashedPwd=await bcrypt.hash(password, 10);

        const user=await User.create({
            email,
            password: hashedPwd,
            name
        });



        

        return res.send(success(201,
            'user created succesfully'
        ))


    } catch (e) {
        return res.send(500,error(e.message));
    }
}

const loginController=async(req,res)=>{
    try {

        const {email,password}=req.body;

        if(!email || !password){
            // return res.status(400).send('fields required')
            return res.send(error(400,'all fileds required'))
        }

        const oldUser=await User.findOne({email}).select('password');
        if(!oldUser){
        //    return res.status(404).send('go and signup')
            return res.send(error(404,'user not found'))
        }

        const matched=await bcrypt.compare(password,oldUser.password);

        if(!matched){
            // return res.status(402).send('wrong pwd')
            return res.send(error(402,'wrong pwd'));
        }

        const accessToken=generateAccessToken({_id:oldUser._id})
        const refreshToken=generateRefreshToken({_id:oldUser._id})
        
        res.cookie('jwt',refreshToken,{
            httpOnly:true,
            secure:true
        })
        
        // return res.status(201).json({accessToken});
        return res.send(success(201,{
            accessToken,
        }))
        
    } catch (e) {
        
    }
};

//this api will check refresh token validity and generate
//a new acess token
const refershAccessToken=async(req,res)=>{
    const cookies=req.cookies;
    
    if(!cookies){
        return res.send(error(401,'refresh token is required'))
        // return res.status(401).send("refresh token is required");
    }

    const refreshToken=cookies.jwt;

    

    try {
        const decoded=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_PRIVATE_KEY);
        
        const _id=decoded._id;
        const accessToken=generateAccessToken({_id});

        return res.send(success(201,{accessToken}))

    } catch (e) {
        
        // return res.status(401).send('invalid refresh key');
        return res.send(error(401,'invalid refresh key'));
    }

}

//internal functions
const generateAccessToken=(data)=>{
    try{
    const token=jwt.sign(data,process.env.ACCESS_TOKEN_PRIVATE_KEY,{
        expiresIn:"1d",
    });
    
    return token;
    }
    catch(e){
        
    }
}

const generateRefreshToken=(data)=>{
    try{
    const token=jwt.sign(data,process.env.REFRESH_TOKEN_PRIVATE_KEY,{
        expiresIn:"1y",
    });
    
    return token;
    }
    catch(e){
        
    }
}

const logoutController=(req,res)=>{
    try {
        res.clearCookie('jwt',{
            httpOnly:true,
            secure:true
        })
        res.send(success(200,'user logged out'))
    } catch (e) {
        return res.send(error(500,e.message));
    }
}

module.exports={
    signupController,
    loginController,
    refershAccessToken,
    logoutController
}