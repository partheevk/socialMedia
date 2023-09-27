
const { response } = require("express");
const Post = require("../Models/post");
const User = require("../Models/user");
const { success, error } = require("../utils/responseWrapper");
const cloudinary=require('cloudinary').v2;
const mapPostOutput=require('../utils/utils')


const createPost=async(req,res)=>{
    try {

        const {caption,postImg}=req.body;
        if(!caption || !postImg){
            return res.send(error(400,'caption and img are required'));
        }
        
        const cloudImg=await cloudinary.uploader.upload(postImg,{
            folder:'postImg'
        });

        
        const owner=req._id;

        const user=await User.findById(req._id);

        const post=await Post.create({
            owner,
            caption,
            image:{
                publicId:cloudImg.public_id,
                url:cloudImg.url
            },
         });

         
         
         user.posts.push(post._id);

         await user.save();

         

         return res.send(success(201,{post}));

    } catch (e) {
        return res.send(error(500,e.message));
    }
    
}

const likeAndunlikepost=async(req,res)=>{
    try {
        const {postId}=req.body;
        const curid=req._id;

        const post=await Post.findById(postId).populate('owner');
        if(!post){
            return res.send(error(404,'not found post'));
        }

        if(post.likes.includes(curid)){
            const index=post.likes.indexOf(curid);
            post.likes.splice(index,1);

            
        }
        else{
            post.likes.push(curid);
            
        }
        await post.save()
        return res.send(success(200,mapPostOutput(post,req._id)))
    } catch (e) {
        res.send(error(e.message));
    }
    
}

const updatePostController=async(req,res)=>{

    try {
    const {postId,caption}=req.body;
    const curUserId=req._id;

    const post=await Post.findById(postId);

    if(!post){
        return res.send(error(404,'not found post'));
    }
    if(post.owner.toString() !== curUserId){
        return res.send(error(403,'you are not owner'));
    }
    if(caption){
        post.caption=caption;
        
    }
    await post.save();
    return res.send(success(201,{post}));
    } catch (e) {
        return res.send(error(500,e.message));
    }
}

const deletePostController=async(req,res)=>{
    try {
        const {postId}=req.body;
        const curUserId=req._id;
        const post=await Post.findById(postId);

        if(!post){
            return res.send(error(404,'not found post'));
        }
        if(post.owner.toString() !== curUserId){
            return res.send(error(403,'you are not owner'));
        }

        const curuser=await User.findById(curUserId);

        const index=curuser.posts.indexOf(postId);
        curuser.posts.splice(index,1);
        await curuser.save();

        
        await Post.deleteOne({_id:postId});

        return res.send(res.send(success(200,'post deleted')));

    } catch (e) {
        
        return res.send(error(500,e.message));
    }
    


}

module.exports={
                createPost,
                likeAndunlikepost,
                updatePostController,
                deletePostController,
            };