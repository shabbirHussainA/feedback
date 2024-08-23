//crating model for user 
import mongoose,{Schema,Document} from "mongoose";
// creating interface for Message which extends mongoose documents
export interface Message extends Document{
    content: string;
    createdAt: Date
}
//message Schema
const MessageSchema :Schema<Message> = new Schema({
    content:{
        type:String,
        required: true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})
// creating interface for user which extends mongoose documents
export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifyToken:string;
    verifyTokenExpiry:Date;
    isVerified:boolean;
    isAcceptingMessage:boolean;
    messages:Message[];

}
//regex for email
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//userSchema
const UserSchema :Schema<User> = new Schema({
    username:{
        type:String,
        required: [true,"username is required"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        match:[emailRegex,"please enter a valid email"]
    },
    password:{
        type:String,
        required:[true,"password is required"],
    },
    verifyToken:{
        type:String,
        required:[true,"verifyToken is required"],
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    verifyTokenExpiry:{
        type:Date,
        required:[true,"verifyTokenExpiry is required"],
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    messages:[MessageSchema] // accepting array of MessageSchema 
})
// since the nextjs runs on the edge time we have to check weather the db is connected or not if it is not connected than only connection is created
const UserModal = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User",UserSchema))
export default UserModal