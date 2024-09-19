const express = require('express')
const {adminAuth,userAuth} = require('./middlewares/authentication')
const app = express();

app.use("/admin",adminAuth)

app.use("/admin/getData",(req,res)=>{
    res.send("Fetched important data successfully!!")
})
app.use("/admin/deleteData",(req,res)=>{
    res.send("Deleted useless data successfully!!")
})

app.use("/admin",(req,res)=>{
    res.send("Hello you are an authorized admin")
})

app.use("/user/login",(req,res)=>{
    res.send("User login done!")
})


app.use("/user/getFeed",userAuth,(req,res)=>{
    res.send("User feeds send successfully!")
})

app.use("/user/profile",(req,res)=>{
    res.send("User profile loaded!")
})




/*
//Middlewares
app.use("/",(req,res,next)=>{
    console.log("from /");
    // res.send("from / send")
    next()
})

app.use("/user",(req,res,next)=>{
    console.log("inside user1")
    // res.send("Hello user from first");
    next();
},
(req,res,next)=>{
    console.log("inside second");
    // res.send("from 2nd route");
    next()
},
(req,res,next)=>{
    console.log("inside third");
    res.send("from 3rd route");
})
*/

app.listen(7777,()=>{
    console.log("Server is listening on port: 7777")
});