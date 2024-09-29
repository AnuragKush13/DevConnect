const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    firstName: {type:String,
        required:true,
        maxLength:10,
        minLength:3
    },
    lastName :{type:String},
    emailId:{type:String,
        unique:true,
        trim:true,
        required:true,
        validate(value){
            if(!value.includes('@'))
                throw new Error("Invalid EmailId!!")
        }
        
    },
    password:{type:String,
        validate(value){
            return validator.isStrongPassword(value)
        }

    },
    age:{type:Number,
        min:[18,'Age must be greater than 18, so age of {VALUE} is not valid. ' ]
    },
    gender:{type:String},
    skills:{type:[String]},
    about:{
        type:String,
        default:'I love DevConnect...'
    }
},{timestamps:true})
//creating a model out of the schema defined above

userSchema.methods.getJWT = async function () {
    const loggedUser = this;
    const token = await jwt.sign({_id:loggedUser._id}, 'Devconnect@123',{expiresIn:"1d"});
    return token;   
}

userSchema.methods.validatePassword = async function (passwordInputbyUser) {
    const user = this;
    const hashPassword = user.password;
    const isValidUser = await bcrypt.compare(passwordInputbyUser,hashPassword)
    return isValidUser;
}

const User = mongoose.model("user",userSchema);

module.exports = User;