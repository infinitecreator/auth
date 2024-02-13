import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    mobile: String,
    status: {
        type: String,
        enum: ['pending','active'],
        default: 'pending',
    },
    token: String,
    cat: Date,
    upd: Date,

}) ;

const user = mongoose.model('User', userSchema) ; // note this will return class

// using userClass instance which will be saved in the database

export { user as User }