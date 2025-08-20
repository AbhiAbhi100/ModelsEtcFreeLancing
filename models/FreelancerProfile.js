import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
    {
        url:String,
        type:{type:String,enum:["image","video"]},
        publicId:String // for cloudinary/local identifier
    },
    {_id:false}
);

const freelancerProfileSchema = new mongoose.Schema(
    {
        user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true,unique:true},

        displayName:{type:String},

        category:{
            type:String,
            enum:["bodyguard","anchor","actor","model","dancer","others"],
            required:true
        },
        bio:String,
        skills:[String],
        hourlyRate:{type:Number,min:0},
        dailyRate:{type:Number,min:0},
        location:String,
        isAvailable:{type:Boolean,default:true},
        media:[mediaSchema],
        rating:{type:Number,min:0,max:5,default:0},
        jobsCompleted:{type:Number,default:0},
        approved:{type:Boolean,default:true}//admin can do this
    },
    {timestamps:true}
);

export default mongoose.model("FreelancerProfile",freelancerProfileSchema);