const mongoose=require("mongoose");
const taskSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    priority:{
        type:String,
        enum:["low","medium","high"],
        default:"medium"
    },
    dueDate:{
        type:Date
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
},
{
    timestamps:true
}

);
const task=mongoose.model("task",taskSchema);
module.exports=task;