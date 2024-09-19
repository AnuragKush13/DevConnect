const express = require('express')

const app = express();
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


app.listen(7777,()=>{
    console.log("Server is listening on port: 7777")
});