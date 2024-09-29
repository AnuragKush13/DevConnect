const express = require('express');
const requestRouter = express.Router();
const {userAuth} = require('../middlewares/authentication');

requestRouter.post("/sendConnectionRequest",userAuth, async (req,res)=>{
    try{
        const user = req.user;
        res.status(200).send(user.firstName + " sent connection request!!");
        
    }
    catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
})

module.exports = requestRouter;