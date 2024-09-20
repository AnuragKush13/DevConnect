const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {type:String},
    lastName :{type:String},
    emailId:{type:String},
    password:{type:String},
    age:{type:Number},
    gender:{type:String}
})
//creating a model out of the schema defined above
const User = mongoose.model("user",userSchema);

module.exports = User;