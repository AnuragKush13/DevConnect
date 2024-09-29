const express = require('express');
const testRouter =  express.Router();
const User = require('../models/user')



//finds on the basis of firstName
testRouter.get("/user",async (req,res)=>{
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
testRouter.get("/feed",async (req,res)=>{
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

//getting user based on id passed
testRouter.get("/userbyID",async (req,res)=>{
    try{
        const user = await User.findById(req.body)
        //gives error if no id is found also is someother paarameter is given as search
        res.send(user);
    }
    catch(err){res.status(500).send("Some error occured")}
})

testRouter.delete("/user",async (req,res)=>{
    const userId = req.body.userId;
    try{
    await User.findByIdAndDelete(userId);
    res.send("User Deleted Successfully..")}
    catch(err){
        res.status(400).send("Some error occured!!");
    }

})
//update user on the basis of userId
testRouter.patch("/user/:userId",async (req,res)=>{
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
testRouter.delete('/userName',async (req,res)=>{
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


module.exports = testRouter;