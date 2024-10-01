const express = require('express');
const profileRouter = express.Router();
const User = require('../models/user');
const {userAuth} = require('../middlewares/authentication');
const {profileEditValidation,passwordEditValidation} = require('../utils/validation')
const bcrypt = require('bcrypt');
profileRouter.get("/profile/view",userAuth,async (req,res)=>{
    try{
        const user = req.user;
        res.status(200).send(user);
        
    }
    catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
})

profileRouter.patch("/profile/edit",userAuth,async (req,res)=>{
    try{ 
        if(!profileEditValidation(req))
            throw new Error("Invalid Edit Request!!");

        const inputDataObj = req.body;
        const activeUser = req.user;
        Object.keys(inputDataObj).forEach((key)=>{
                activeUser[key] = inputDataObj[key]
        })
        await activeUser.save();
        res.send(`${activeUser.firstName}, your profile was updated successfully!!`);
    }
     catch(err){
        res.send("ERROR::"+err.message)
     }
})

profileRouter.patch('/profile/password',userAuth,async (req,res)=>{
    try{
        if(!passwordEditValidation(req))
            throw new Error("Invalid Edit Request!!");
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        req.user.password = hashedPassword;
        await req.user.save();
        res.send("Password updated successfully!!")
    }
    catch(err){
        res.send("ERROR::"+err.message)
    }
})

module.exports = profileRouter;