const express = require('express');
const { userAuth } = require('../middlewares/authentication');
const ConnectionRequestModel = require('../models/connectionRequest');
const userRouter = express.Router();
const User = require('../models/user')
const USER_SAFE_DATA = "firstName lastName age about gender skills photoUrl";
userRouter.get("/user/requests/received",userAuth,async (req,res)=>{
    try{
        const loggedInUser = req.user;
        //status == interested
        //touserId = loggedInUserId
        const connectionRequest = await ConnectionRequestModel.find({
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

        const connectionRequest = await ConnectionRequestModel.find({
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

userRouter.get("/feed",userAuth,async (req,res)=>{
    try{

        const loggedInUser = req.user;
        const page = req.query.page || 1;
        let limit = req.query.limit || 10;
        limit = limit > 50 ? 50 :limit;
        const skip = (page-1) * limit;
        //remove loggedinuser
        //remove those users whose ids are present in connections table
        const connectionRequest = await ConnectionRequestModel.find({
            $or:[
                {toUserId:loggedInUser._id },
                {fromUserId:loggedInUser._id }
            ]
        }).select("fromUserId toUserId")
       const hideUsersFromFeed = new Set();
       connectionRequest.forEach((request)=>{
        hideUsersFromFeed.add(request.fromUserId);
        hideUsersFromFeed.add(request.toUserId);
       })

       const feedUsers = await User.find({
        _id: {$nin: Array.from(hideUsersFromFeed)}
       }).select(USER_SAFE_DATA).skip(skip).limit(limit)
       res.send(feedUsers)
    }
    catch(err){
        res.status(400).send("ERROR::"+err.message)
    }
})

module.exports = userRouter;
