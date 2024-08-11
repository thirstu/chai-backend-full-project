import mongoose ,{Schema} from "mongoose";

const subscriptionSchema = new Schema({
    subscriber:{
        type:Schema.Types.ObjectId,////the one who is subscribing to others ---(how many channels I have subscribed to)
        ref:"User"
    },
    Channel:{
        type:Schema.Types.ObjectId,////to whom the subscriber is subscribing  (to the channel) to me----(how many users subscribed to my channel)
        ref:"User"
    }


},{timestamps:true});

export const Subscription=mongoose.model('Subscription',subscriptionSchema)
