const express = require('express');
const requestRouter = express.Router();
const {userAuth} = require('../middlewares/authentication');
const ConnectionRequest = require('../models/connectionRequest');
requestRouter.post("/request/:status/:toUserId",userAuth, async (req,res)=>{
    try{
        const toUserId = req.params.toUserId;
        const fromUserId = req.user._id;
        const status = req.params.status;
        const connectionRequest = new ConnectionRequest({
            toUserId,fromUserId,status
        })
        await connectionRequest.save();
        res.status(200).send(req.user.firstName + " sent connection request!!");
        
    }
    catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
})

module.exports = requestRouter;