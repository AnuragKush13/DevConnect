const adminAuth = (req,res,next)=>{
    const authToken = "12345"
    const adminAuthorized = authToken === '12345'
    if(adminAuthorized)
       next();
    else
    res.send("Not authorized to access!")
}
const userAuth = (req,res,next)=>{
    const authToken = "1234ds5"
    const userAuthorized = authToken === '12345'
    if(userAuthorized)
        next();
    else
    res.status(401).send("User not authorized to access!")
}
module.exports ={adminAuth,userAuth}