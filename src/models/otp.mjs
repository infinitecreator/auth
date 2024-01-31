import mongoose from "mongoose";

const otpSchema = mongoose.Schema({
    otp: String,
    cat: Date,
    exp: Date,
    email: String,

}) ;

const otpClass = mongoose.model('Otp',otpSchema) ;
export {otpClass as Otp} 
