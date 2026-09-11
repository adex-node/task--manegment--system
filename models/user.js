const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    FullName:{
        type:String,
        trim:true,
        required:[true ,'name is required']
    },
    email:{
        type:String,
        lowercase:true,
        trim:true,
        unique:true,
        required:[true,'email  is required']
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    }
});
const user=mongoose.model("user",userSchema);
module.exports=user;