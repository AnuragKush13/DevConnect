const express = require('express')
const connectDB = require('./config/database')
const User = require('./models/user')
const {signUpValidation} = require('./utils/validation')
const bcrypt = require('bcrypt')
const { default: isEmail } = require('validator/lib/isEmail')
const { default: mongoose } = require('mongoose')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json())
app.use(cookieParser())

//finds on the basis of firstName
app.get("/user",async (req,res)=>{
    try{
        const user = await User.find(req.body);
        if(user.length == 0)
            res.status(401).send("No users found!!")
        else
            res.send(user);
    }
    catch(err){
        res.status(400).send("Error getting data")
    }
    
    
})

//feed api to show all user data
app.get("/feed",async (req,res)=>{
    try{
        const users =await User.find({})
        if(users.length == 0)
            res.status(401).send("No users found!!")
        else
            res.send(users);
    }
    catch(err){
        console.log("Error loading feed ",err)
        res.status(400).send("Error loading feed!!")
    }
    
})

//adds the user data to collection
app.post("/signup",async (req,res)=>{   
    const {firstName,lastName,emailId,password} = req.body;
    try{
        //validating req body
        signUpValidation(req);
        //password encryption
        const encrptedPassword =await bcrypt.hash(password,10);
        console.log(encrptedPassword)
        const user = new User({firstName,lastName,emailId,password:encrptedPassword});
        await  user.save();
        res.send("User added Successfully..");}
    catch(err){
        res.status(400).send("Some error occured!! :: "+err.message);
    }
    
})


//login api
app.post("/login", async (req,res)=>{
    try{
       

        const {emailId,password} = req.body;
        if(!isEmail(emailId))throw new Error("Invalid Credential!!")
        const user = await User.findOne({emailId:emailId})
        if(!user)throw new Error("Invalid Credential!!")
        const validUser = await bcrypt.compare(password,user.password);
        console.log(validUser)
        if(!validUser)throw new Error("Invalid Credentials!!")
        else{
            //creating webtoken for valid logins
            const token = jwt.sign(req.body._id, 'Devconnect@123')
            res.cookie("token",token);
            res.status(200).send("Login Successfull!!")    }
    }
    catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
})


//profile
app.get("/profile",async (req,res)=>{
    try{
        const cookies = req.cookies;
        const {token} = cookies;
        //validating my token
        const userId = jwt.verify(token,'Devconnect@123');
        if(userId)
            {
                const user = await User.findById({_id:userId});
                if(user)
                res.send(user);
                else
                throw new Error("User not found!!")
            }
        else{
            throw new Error("Not Valid!!")
        }
        
    }
    catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
})

//getting user based on id passed
app.get("/userbyID",async (req,res)=>{
    try{
        const user = await User.findById(req.body)
        //gives error if no id is found also is someother paarameter is given as search
        res.send(user);
    }
    catch(err){res.status(500).send("Some error occured")}
})

app.delete("/user",async (req,res)=>{
    const userId = req.body.userId;
    try{
    await User.findByIdAndDelete(userId);
    res.send("User Deleted Successfully..")}
    catch(err){
        res.status(400).send("Some error occured!!");
    }

})
//update user on the basis of userId
app.patch("/user/:userId",async (req,res)=>{
    const userId = req.params?.userId;
    try{
    const ALLOWED_UPDATES = ["gender","lastName","skills"]
    const isUpdateAllowed = Object.keys(req.body).every((k)=>
          ALLOWED_UPDATES.includes("gender")
    )
    if(!isUpdateAllowed){throw new Error("Update Not Allowed!!!")}

    const user = await User.findByIdAndUpdate(userId,req.body,{runValidators:true,returnDocument:'after'});
    res.send(user);
    }
    catch(err){
        res.status(400).send("Some Error Occured::"+err.message)
    }
})

//to delete all documents on the basis of userName 
app.delete('/userName',async (req,res)=>{
try{
    console.log(req.body.firstName)
    const users = await User.find(req.body);
    console.log(users)
    var usercount = users.length;
    for(var i = 0 ; i< usercount ;i++)
        await User.findOneAndDelete(req.body);
    res.send(usercount+" user Deleted");
}catch(err)
{
    res.send("some error occured"+err.message)
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
