import dbConnect from "@/lib/dbCOnnect";
import UserModal from "@/models/User.model";
import {z} from "zod"
import {usernameValidation} from "@/schemas/signupSchema"
import { NextRequest } from "next/server";
import { url } from "inspector";

const UsernameQuerrySchema = z.object({
    username: usernameValidation
})
export async function GET(request:NextRequest) {
    // if(request.method !== 'GET'){
    //     return Response.json(
    //         {
    //             success:false,
    //             message:"this method is not accepted"
    //         },{status:405})
    // }
    await dbConnect()
    try {
        // getting username param from the url
        const {searchParams} = new URL(request.url)
        const querryParam = {
            username: searchParams.get('username')
        }
        //validate with zod
       const result =  UsernameQuerrySchema.safeParse(querryParam)
       console.log(result)
       if(!result.success){
        const usernameError = result.error.format().username?._errors || []
        return Response.json({
            success: false,
            message: usernameError?.length > 0 ? usernameError.join(', ') : "Invalid querry parameter",
        },{status:400})
       }
       const {username } = result.data
       const existingVerifiedUser = await UserModal.findOne({username, isVerified : true})
       if (existingVerifiedUser){
        return Response.json({
            success: false,
            message: "username is already taken"
        },{status:400})
       }
       return Response.json({
        success: false,
        message: "username is unique"
    },{status:400})
    } catch (error) {
        console.error("Error Checking Username" , error)
        return Response.json(
            {
                success:false,
                message:"Error checking username"
            },{status:500}
        )
    }
}
