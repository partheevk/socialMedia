const mongoose=require('mongoose');

module.exports = async()=>{
    const mongoUri = "mongodb+srv://partheevkonduru2:LyZYh62qiM3a8Ikg@cluster0.xcshqwm.mongodb.net/?retryWrites=true&w=majority"
    try{
    const connect= await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('db connected',connect.connection.host);
    }
    catch(error){
        console.log(error);
        process.exit(1);
    }

}