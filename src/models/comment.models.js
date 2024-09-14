import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

import { User } from "./user.models.js";

const commentSchema=new Schema({

    content:{
        type:String,
        required:true,
        
    },
    videoId:{
        type:Schema.Types.ObjectId,
        ref:"Video",
        required:true,

    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,

    }
},{timestamps:true});


commentSchema.plugin(mongooseAggregatePaginate)

export  const Comment =mongoose.model('Comment',commentSchema);