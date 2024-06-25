const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    hashPassword: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String, 
        required: true
    },
    birthDate: {
        type: String
    },
    streetAddress: {
        type: String, 
        required: true
    },
    Landmark: {
        type: String
    },
    Country: {
        type: String,
        required: true
    },
    City: {
        type: String,
        required: true
    },
    secondaryPhoneNumber: {
        type: String 
    },
    postalCode: {
        type: String, 
        required: true
    }
});

userSchema.statics.createAndRegister = async function (password , otherDetails){
    let hash = await bcrypt.hash(password , 12);
    let newUser = await User.create({hashPassword : hash, ...otherDetails});
    return newUser._id;
}

userSchema.statics.evaluateAndAuthenticate = async function (Email , Password){
    const foundUser= await User.findOne({Email});
    if(!foundUser){
        return null;
    }
    let result = await bcrypt.compare(Password , foundUser.hashPassword);    
    let userId = null;
    if(result == true){
        userId = foundUser._id;
    }
    return userId;
}

const User = mongoose.model('User', userSchema);

module.exports = User;
