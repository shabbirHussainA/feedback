import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbCOnnect";
import UserModal from "@/models/User.model";
import { User } from "next-auth";
import { NextRequest } from "next/server";
import mongoose from "mongoose";

export async function GET(request: NextRequest){
    await dbConnect()
    const session =await getServerSession(authOptions)
    const user:User = session?.user as User;
    if(!session || !session.user){
        return Response.json({
            message:"not authenticated",
            success: false,
        },{status:401})
    }
    //getting user Id in mongooseObject format
    const userID =new mongoose.Types.ObjectId(user._id)
try {
    //creating userModal aggregation Pipeline to target and format the messages array
    const user = await UserModal.aggregate([
        {$match:{id:userID}}, //getting all the messages of userID
        {$unwind:"$messages"},//unwinding from the array
        {$sort:{'messages.createdAt':-1}}, // sorting in descending order
        {$group:{_id:"$_id",messages:{$push:"messages"}}} // grouping the m into one array
    ])
    if(!user || user.length === 0 ){
        return Response.json({
            message:"User not found",
            success: false,
        },{status:401})
    }
    return Response.json({
        message:"User found",
        success: true,
        messages: user[0].messages // getting the messages
    },{status:200})
} catch (error) {
    console.log("unexpected error ", error)
    return Response.json({
        message:"unexpected error occured",
        success: false,
    },{status:500})
}

}