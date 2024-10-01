const express = require('express');
const authRouter = express.Router();
const {signUpValidation} = require('../utils/validation')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { isEmail } = require('validator')

authRouter.post("/signup",async (req,res)=>{   
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


authRouter.post("/login", async (req,res)=>{
    try{
        const {emailId,password} = req.body;
        if(!isEmail(emailId))throw new Error("Invalid Credential!!")
        const user = await User.findOne({emailId:emailId})
        if(!user)throw new Error("Invalid Credential!!")
        const validUser =await  user.validatePassword(password);
        if(!validUser)throw new Error("Invalid Credentials!!")
        else{
            //creating webtoken for valid logins
            const token = await user.getJWT();
            res.cookie("token",token,{expires:new Date(Date.now() + 900000)});
            res.status(200).send("Login Successfull!!")    }
    }
    catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
})

authRouter.post("/logout",async (req,res)=>{
    try{
        const {token} = req.cookies;
        res.clearCookie("token");
        res.status(200).send("User Logged out successfully!!")

    }
    catch(err){ res.status(400).send("ERROR : "+err.message);}
})

module.exports = authRouter;