const router=require('express').Router();
const postsController=require('../Controllers/postsController')
const requireUser=require('../MIddleware/requireUser')


router.post('/',requireUser,postsController.createPost)
router.post('/like',requireUser,postsController.likeAndunlikepost)
router.put('/',requireUser,postsController.updatePostController)
router.delete('/',requireUser,postsController.deletePostController)



module.exports=router;