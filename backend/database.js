import mongoose from "mongoose"


const connectDB=async ()=>{
    try {
        await mongoose.connect("mongodb://localhost:27017/Ecommerce")
        console.log("db connceted")
    } catch (error) {
        console.log(error)
    }
}


export default connectDB;

// const mongoose=require('mongoose')
// mongoose.connect("mongodb://127.0.0.1:27017/Ecommerce")


