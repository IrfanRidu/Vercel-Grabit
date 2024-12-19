import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()



if(!process.env.MONGODB_URI){
    throw new Error(
        "Please provide MONGODB_URI in the .env file"
    )
}
const URI=process.env.MONGODB_URI
async function connectDB(){
    try {
        await mongoose.connect(URI)
        console.log("connect DB")
    } catch (error) {
        console.log("Mongodb connect error",error)
        process.exit(1)
    }
}

export default connectDB