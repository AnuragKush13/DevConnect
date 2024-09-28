const validator = require('validator');
const signUpValidation = (req)=>{
    const {firstName,lastName,emailId,password} = req.body;

    if(!firstName || !lastName)
        {
            throw new Error("Data not correct!!")
        }
    else if(!validator.isEmail(emailId))
        throw new Error("EmailId is not valid!!")
    else if(!password)
        throw new Error("Please enter password")
    else if(!validator.isStrongPassword(password))
        throw new Error("Please enter strong password!!")
}

module.exports = {signUpValidation}