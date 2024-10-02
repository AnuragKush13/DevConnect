const express = require('express');
const { userAuth } = require('../middlewares/authentication');
const connectionRequestModel = require('../models/connectionRequest');
const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName age about gender skills photoUrl";
userRouter.get("/user/requests/received",userAuth,async (req,res)=>{
    try{
        const loggedInUser = req.user;
        //status == interested
        //touserId = loggedInUserId
        const connectionRequest = await connectionRequestModel.find({
            status :"interested",
            toUserId:loggedInUser._id
        }).populate("fromUserId",USER_SAFE_DATA)
        res.send(connectionRequest)
    }
    catch(err){
        res.status(400).send("ERROR:: "+err.message);
    }
})

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;

        const connectionRequest = await connectionRequestModel.find({
            $or:[
                {toUserId:loggedInUser._id,
                    status:"accepted"
                },
                {fromUserId:loggedInUser._id,
                    status:"accepted"
                }
            ]
        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA)
        if(!connectionRequest)return res.status(200).send("No connections requests available");

        const data = connectionRequest.map((row)=>{
            if(row.toUserId._id.toString() === loggedInUser._id.toString())return row.fromUserId;
            return row.toUserId;
        })
        res.status(200).json({data})
    }
    catch(err)
    {
        res.status(400).send("ERRRO:: "+err.message)
    }
})

module.exports = userRouter;
