const express = require('express');
const requestRouter = express.Router();
const {userAuth} = require('../middlewares/authentication');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const { connection } = require('mongoose');
requestRouter.post("/request/:status/:toUserId",userAuth, async (req,res)=>{
    try{
        const toUserId = req.params.toUserId;
        const fromUserId = req.user._id;
        const status = req.params.status;
        //allowed params
        const allowed_status = ["ignored","interested"];
        const isAllowed = allowed_status.includes(status);
        if(!isAllowed)throw new Error("Status not allowed "+status)
        //check both the ids are not same
        if(toUserId==fromUserId) 
            throw new Error("Cannot send connection request to yourself!!")
        //check if user exists
        const toUser = await User.findById(toUserId);
        if(!toUser)
            return res.status(400).send("User does not exist!!");
        //check if already request available
        const connectionExist = await ConnectionRequest.findOne({   
            $or:[{toUserId,fromUserId},{toUserId:fromUserId,fromUserId:toUserId}]
        })
        if(connectionExist){
            //updating status 
            if(connectionExist.status != status && connectionExist.status)
            {
                connectionExist.status = status;
                await connectionExist.save();
                return res.status(200).json({message:"Connection Request status updated to "+status +" for "+toUser.firstName ,
                    data:connectionExist});
            }
            return res.status(400).json({message:"Connection Request Already Exists!!",
                data:connectionExist});
                
        }
            
        const connectionRequest = new ConnectionRequest({
            toUserId,fromUserId,status
    })

        const data = await connectionRequest.save();
        res.status(200).json({message:req.user.firstName + " set connection status to "+status+" for "+toUser.firstName,
            data
        });
        
    }
    catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
})

module.exports = requestRouter;