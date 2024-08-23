import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbCOnnect";
import UserModal from "@/models/User.model";
import { User } from "next-auth";
import { NextRequest } from "next/server";
// it is usd to updated the value of the isAcceptingMesssge
export async function POST(request:NextRequest){
    await dbConnect() // connecting to the db
    const session = await getServerSession(authOptions) // getting the session from nextauth
    const user:User = session?.user as User  //getting user from session
    if(!session || !session.user){
        return Response.json({
            message:"not authenticated",
            success: false,
        },{status:401})
    }
    // getting user ID from user
    const userID = user._id
    const {acceptMessages} = await request.json() // accept Message 
    try {
        const updatedUser = await UserModal.findByIdAndUpdate(userID,{isAcceptingMessage:acceptMessages},{new:true}) //finding and updating the use with the acceptMessage value

        if(!updatedUser){ // if not successfully updated
            return Response.json({
                message:"user doesnot exist",
                success: false,
            },{status:401})
        }
        return Response.json({// if successfully updated
            message:"message status updated successfully",
            success: true,
            updatedUser,
        },{status:200})
    } catch (error) { 
        console.log("failed to update user status to accept messages")
        return Response.json({
            message:"failed to update user status to accept messages",
            success: false,
        },{status:500})
    }
}
// it is used to get the value of the isAcceptingMessages
export async function GET(request:NextRequest){
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user:User = session?.user as User
    if(!session || !session.user){
        return Response.json({
            message:"not authenticated",
            success: false,
        },{status:401})
    }
    const userID = user._id
   try {
    const foundUser = await UserModal.findById(userID)
    //if user is not found
    if(!foundUser){
     return Response.json({
         message:"user could not be found",
         success: false,
     },{status:404})
    }
    //if user is found
    return Response.json({
     message:"user found succesfully",
     success: true,
     isAcceptingMessages:foundUser.isAcceptingMessage
 },{status:200})
   } catch (error) {
    return Response.json({
        message:"error in getting message acceptance status",
        success: false
    },{status:500})
   }

}