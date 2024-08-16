import UserModal from "@/models/User.model";
import dbConnect from "@/lib/dbCOnnect";
import { Message } from "@/models/User.model";
import { NextRequest } from "next/server";


export async function POST(request:NextRequest){
    await dbConnect()
    const {username,content} =await request.json() //getting the values from json
    try {
        const user = await UserModal.findOne({username}) //finding the user
        if(!user){
            return Response.json({
                message:"user not found",
                success: false,
            },{status:404})
        }
        //if user doesnot accepts messages
        if(user.isAcceptingMessage){
            return Response.json({
                message:"user does not accepts messages",
                success: false,
            },{status:403})
        }
        //creating new messages
        const newMesage = {content, createdAt:new Date()}
        user.messages.push(newMesage as Message) // pushing the message into messages array
        await user.save() // saving the user
        return Response.json({
            message:"message send succesfully",
            success: true,
        },{status:200})
    } catch (error) {
        console.log("error adding messages", error)
        return Response.json({
            message:"error adding messages",
            success: false,
        },{status:500})
    }
}