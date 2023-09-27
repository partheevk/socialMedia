
const Post = require("../Models/post");

const User = require("../Models/user");
const { error, success } = require("../utils/responseWrapper");
const mapPostOutput = require("../utils/utils");
const cloudinary=require('cloudinary').v2;


const followUserAndunfollow=async(req,res)=>{

    try {
    const {userIdToFollow}=req.body;
    const curUserId=req._id;

    const usertoFollow=await User.findById(userIdToFollow);
    const curUser=await User.findById(curUserId);

    if(!usertoFollow){
        return res.send(error(404,'user not found'));
    }

    if(userIdToFollow === curUserId){
        return res.send(error(500,'cant follow yourself'));
    }

    if(curUser.following.includes(userIdToFollow)){
        const index=curUser.following.indexOf(userIdToFollow);
        curUser.following.splice(index,1);

        const curUserindex=usertoFollow.followers.indexOf(curUserId);
        usertoFollow.followers.splice(curUserindex,1);

        
    }
    else{
        curUser.following.push(userIdToFollow);
        usertoFollow.followers.push(curUserId);
        
    }
    await usertoFollow.save();
    await curUser.save();

    return res.send(success(200,{user: usertoFollow}))
    } catch (e) {
        return res.send(error(500,e.message));
    }

}

const getPostsOfFollowing =async(req,res)=>{
    try {
    const curUserId=req._id;

    const curUser=await User.findById(curUserId).populate("following");

    const fullposts=await Post.find({
        'owner':{
            '$in':curUser.following
        }
    }).populate('owner');
    const posts=fullposts.map(item=>mapPostOutput(item,req._id)).reverse();
    

    const followings=curUser.following.map(item=>item._id);
    followings.push(curUserId);

    const suggestions=await User.find({
        _id:{
            '$nin':followings,
        }
    })


    return res.send(success(200,{...curUser._doc,suggestions,posts}));
    } catch (e) {
        return res.send(error(500,e.message));
    }
    
}

const getMyPosts=async(req,res)=>{
    try {
        const curuserId=req._id;
        const curuser=await User.findById(curuserId);
        if(!curuser){
            return res.send(error(404,'user not found'));
        }
        const myposts=await Post.find({owner:curuserId}).populate('likes');

        return res.send(success(200,myposts));

    } catch (e) {
        return res.send(error(500,e.message));
    }
}
const getUserPosts=async(req,res)=>{
    try {
        const {curuserId}=req.body;
        if(!curuserId){
            return res.send(error(402,'user id required'));
        }
        const curuser=await User.findById(curuserId);
        if(!curuser){
            return res.send(error(404,'user not found'));
        }
        const myposts=await Post.find({owner:curuserId}).populate('likes');

        return res.send(success(200,myposts));

    } catch (e) {
        return res.send(error(500,e.message));
    }
}

const deleteMyprofile=async (req,res)=>{
    try {
    const userId=req._id;
    const curuser=await User.findById(userId);

    if(!curuser){
        return res.send(error(404,'no user found'));
    }

    //delete all posts
    await Post.deleteMany({owner:userId});

    //remove myself from others following list
    

    for(const followId of curuser.followers){
        const follower=await User.findById(followId);
        const index=follower.following.indexOf(userId);
        follower.following.splice(index,1);
        await follower.save();
    }

    //remove myself from my following followers list
    for(const followId of curuser.following){
        const following=await User.findById(followId);
        const index=following.followers.indexOf(userId);
        following.followers.splice(index,1);
        await following.save();
    }

    //remove my likes on other posts
    const allposts=await Post.find();
    for(const post of allposts){
        const index=post.likes.indexOf(userId);
        post.likes.splice(index,1);
        await post.save();
    }

    await User.deleteOne({_id:userId});

    res.clearCookie('jwt',{
        httpOnly:true,
        secure:true
    });
    return res.send(success(200,'user deleted'));
    } catch (e) {
        return res.send(error(500,e.message));
    }

}

const getMyInfo = async(req,res)=>{
    
    try {
        
        const user=await User.findById(req._id);
        return res.send(success(200,{user}));
    } catch (e) {
        return res.send(error(500,e.message));
    }
    

}

const updateUserProfile = async(req,res)=>{
    try {
        const{name,bio,userImg}=req.body;

        const user=await User.findById(req._id);

        if(name){
            user.name=name;
        }
        if(bio){
            user.bio=bio;
        }
        if(userImg){
            const cloudImage=await cloudinary.uploader.upload(userImg,{
                folder:'profileImg'
            })
            user.avatar={
                url:cloudImage.secure_url,
                publicId:cloudImage.public_id
            }
        }
        await user.save();
        
        return res.send(success(200,{user}));
    } catch (e) {
        res.send(error(e.message));
    }
}

const getUserProfile=async(req,res)=>{
    
    try {
        const userId=req.body.userId;
        const user=await User.findById(userId).populate({
            path:'posts',
            populate:{
                path:'owner'
            }
        });
        const fullposts=user.posts;
        const posts=fullposts.map(item=>mapPostOutput(item,req._id)).reverse();
        return res.send(success(200,{...user._doc,posts}));
    } catch (e) {
        return res.send(error('500',e.message));
    }
}

module.exports={
    followUserAndunfollow,
    getPostsOfFollowing,
    getMyPosts,
    getUserPosts,
    deleteMyprofile,
    getMyInfo,
    updateUserProfile,
    getUserProfile
}