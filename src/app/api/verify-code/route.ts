import dbConnect from "@/lib/dbCOnnect";
import UserModal from "@/models/User.model";
import {z} from "zod"
import {verifyValidation} from "@/schemas/verifySchema"
import { NextRequest } from "next/server";
const verifyCodeQuerrySchema = z.object({
    code:verifyValidation
})

export async function POST(request:NextRequest){
    await dbConnect();
    try {
        const {username, code} = await request.json()
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModal.findOne({
            username:decodedUsername
        })
        if(!user){
            return Response.json(
                {
                    success:false,
                    message:"user not found"
                },{status:500}
            )
        }
        const isCodeValid = user.verifyToken === code
        const isCodeNotExpire =new Date(user.verifyTokenExpiry) > new Date()
        if(isCodeNotExpire && isCodeValid){
            user.isVerified = true
            await user.save()
            return Response.json(
                {
                    success:true,
                    message:"Account verified successfully"
                },{status:200}
            )
        }else if(!isCodeNotExpire){
            return Response.json(
                {
                    success:false,
                    message:"verify code is expired"
                },{status:400}
            )
        }else{
            return Response.json(
                {
                    success:false,
                    message:"invalid code"
                },{status:400}
            )
        }
    } catch (error) {
        console.error("Error Checking code" , error)
        return Response.json(
            {
                success:false,
                message:"Error checking code"
            },{status:500}
        )
    }
}