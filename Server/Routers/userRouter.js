const requireUser =require('../MIddleware/requireUser')
const userController=require('../Controllers/userController')
const router=require('express').Router();

router.post('/follow',requireUser,userController.followUserAndunfollow)
router.get('/getFeedData',requireUser,userController.getPostsOfFollowing)
router.get('/myposts',requireUser,userController.getMyPosts);
router.get('/userposts',requireUser,userController.getUserPosts);
router.delete('/',requireUser,userController.deleteMyprofile);
router.get('/getMyInfo',requireUser,userController.getMyInfo);
router.put('/',requireUser,userController.updateUserProfile);
router.post('/getUserProfile',requireUser,userController.getUserProfile)
module.exports=router;