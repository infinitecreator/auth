import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,

}) ;

const user = mongoose.model('User', userSchema) ; // note this will return class

// using userClass instance which will be saved in the database

export { user as User }