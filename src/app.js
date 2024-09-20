const express = require('express')
const connectDB = require('./config/database')
const User = require('./models/user')
const app = express();



app.post("/signup",async (req,res)=>{
    const userObj ={
        firstName :"Happy",
        lastName:"Kushwaha",
        emailId:"anurag@gmail.com",
        password:"xdfsf@123"

    }
    //creating a new instance of the user model
    try{const user = new User(userObj);
        await  user.save();
        res.send("User added Successfully..");}
    catch(err){
        res.status(400).send("Some error occured!!");
    }
    
})



connectDB().then(()=>{
    console.log("Database connection succesfull..")
    app.listen(7777,()=>{
        console.log("Server is listening on port: 7777")
    });
}).catch((err)=>{
    console.error("Databse connection failed!!")
})
