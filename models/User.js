
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name:{type:String,required:true,trim:true},
        email:{type:String,required:true,unique:true, lowercase:true},
        password:{type:String,required:true},
        role:{type:String,enum:["freelancer","client","admin"],default:"client"},
        isBanned:{type:Boolean,default:false}
    },
    {timestamps:true}
);

export default mongoose.model("User",userSchema);