const express = require('express')
const connectDB = require('./config/database')
const cookieParser = require('cookie-parser');
const cors = require("cors");
const app = express();
app.use(cors(
    {
        origin:["http://localhost:5173","https://dev-connect-web.vercel.app"],
        credentials:true
    }
))
app.use(express.json())
app.use(cookieParser())

const authRouter = require('./routers/auth');
const profileRouter = require('./routers/profile');
const requestRouter = require('./routers/request');
const userRouter = require('./routers/user');

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter)
connectDB().then(()=>{
    console.log("Database connection succesfull..")
    app.listen(7777,()=>{
        console.log("Server is listening on port: 7777")
    });
}).catch((err)=>{
    console.error("Databse connection failed!!")
})
