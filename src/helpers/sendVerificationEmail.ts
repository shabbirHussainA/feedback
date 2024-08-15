//creating function to send the email
import { resend } from "@/lib/resend";
import { VerificationEmail } from "../../emails/verificationEmail";
 import ApiResponse from "@/types/ApiResponse";

 export async function SendVerificaationEmail(
    username:string,
    verifycode:string,
    email:string
//this return a promise of type ApiResponse
 ):Promise<ApiResponse>{
    try {
         await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Feedback App | Verification Email',
            react: VerificationEmail({OTP:verifycode,username})//this is the template
          });
        return{message:"successfully send the email",success: true}
    } catch (emailError) {
        console.error("failed to send verification email", emailError)
        return{message:"failed to send email",success: false}
    }
 }