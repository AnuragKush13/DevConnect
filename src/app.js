const express = require('express')
const connectDB = require('./config/database')
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json())
app.use(cookieParser())

const authRouter = require('./routers/auth');
const profileRouter = require('./routers/profile');
const requestRouter = require('./routers/request');

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);

connectDB().then(()=>{
    console.log("Database connection succesfull..")
    app.listen(7777,()=>{
        console.log("Server is listening on port: 7777")
    });
}).catch((err)=>{
    console.error("Databse connection failed!!")
})
