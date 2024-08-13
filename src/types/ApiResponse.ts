import { Message } from "@/models/User.model";

export default interface ApiResponse{
    success:boolean;
    message:string;
    messages?:Array<Message>
    isAcceptingMessages?:boolean;
}