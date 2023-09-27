const express=require('express');
const dotenv=require('dotenv');
const dbConnect=require('./dbConnect')
const authRouter=require('./Routers/authRouter')
const postsRouter=require('./Routers/postsRouter')
const userRouter=require('./Routers/userRouter')
const morgan=require('morgan')
const cookieParser=require('cookie-parser')
const cors=require('cors')
const cloudinary=require('cloudinary').v2;




dotenv.config('./.env');

// Configuration 
cloudinary.config({
    secure:true,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

const app=express();

//Middlewares
app.use(express.json({limit:"10mb"}));
app.use(morgan('common'))
app.use(cookieParser());
app.use(cors({
    credentials:true,
    origin:'http://localhost:3000'
}));


app.use('/auth',authRouter)
app.use('/posts',postsRouter);
app.use('/user',userRouter);




app.get('/',(req,res)=>{
    res.status(200).send('ok from server 200');  
})

const PORT=process.env.PORT || 4001;


dbConnect();
app.listen(PORT,()=>{
    console.log('listening on port',PORT);
    
})