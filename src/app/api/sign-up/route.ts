// import UserModal, { Message } from "@/models/User.model";
// import dbConnect from "@/lib/dbCOnnect";
// import bcrypt from 'bcryptjs'
// import { NextRequest, NextResponse } from "next/server"; 
// import { SendVerificaationEmail } from "@/helpers/sendVerificationEmail";

// export async function POST(request:NextRequest) { //1
//     await dbConnect(); //connecting to the dB
//     try {
//         // getting data from the req
//         const {username, email, password} = await request.json()
//         // geting user registered with the same username
//        const existingUserByusername =  await UserModal.findOne({
//             username,
//             isVerified : true
//         })
//         //sending the negative response if the username is already regstered
//         if(existingUserByusername ){
//             return Response.json({
//                 message:"this user is already registered",
//                 success:false
//             },{status:400});
//         }
//         //getting user registered with the same email
//         const existingUserByemail =  await UserModal.findOne({email});
//         const verifyToken = Math.floor(100000 + Math.random() * 900000).toString()
//         // handling if the user is already registered with the same id 
//         if(existingUserByemail){
//             // handling if the user is verified 
//             if(existingUserByemail.isVerified){
//                 return Response.json({
//                     message:"user already registered with this email address",
//                     success:false
//                 },{status:500})
//             }else{
//                 // saving the existing user
//                 const hashedPassword = await bcrypt.hash(password,10);
//                 existingUserByemail.password = hashedPassword;
//                 existingUserByemail.verifyToken = verifyToken;
//                 existingUserByemail.verifyTokenExpiry = new Date(Date.now() + 3600000)
//                 await existingUserByemail.save()
//             }
//         }else{
//         // handling if the user has come the first time
//             //creating hashedPassword
//             const hashedPassword = await bcrypt.hash(password,10);
//             //setting verifyToken Expiry date
//             const verifyTokenExpiry = new Date()
//             verifyTokenExpiry.setHours(verifyTokenExpiry.getHours() + 1);
//             // creating user obj
//             const newUser = new UserModal({
//                 username,
//                 email,
//                 password:hashedPassword,
//                 verifyToken,
//                 verifyTokenExpiry,
//                 isVerified:false,
//                 isAcceptingMessage:true,
//                 messages:[]
//             })
//             //saving the userObj to the db
//             await newUser.save()
//         }
//         //send verification email
//         const emailResonse = await SendVerificaationEmail(username,verifyToken,email)
//         // to handle error in emailResonse
//         if(!emailResonse.success){
//             return Response.json({
//                 message:emailResonse.message,
//                 success:false
//             },{status:500})
//         }
//         // else return true 
//         return Response.json({
//             message:"user registered successfully, please verify your email",
//             success:true
//         },{status:500})
//     } catch (error) {
//         console.error("error registering user", error)
//        return Response.json(
//         {
//             message:"",
//             success: false,
//         },{status:500})
//     }
// }
import UserModal, { Message } from "@/models/User.model";
import dbConnect from "@/lib/dbCOnnect";
import bcrypt from 'bcryptjs';
import { SendVerificaationEmail } from '@/helpers/sendVerificationEmail';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const existingVerifiedUserByUsername = await UserModal.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      return Response.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModal.findOne({ email });
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: 'User already exists with this email',
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyToken = verifyCode;
        existingUserByEmail.verifyTokenExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModal({
        username,
        email,
        password: hashedPassword,
        verifyToken:verifyCode,
       verifyTokenExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      await newUser.save();
    }

    // Send verification email
    const emailResponse = await SendVerificaationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'User registered successfully. Please verify your account.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return Response.json(
      {
        success: false,
        message: 'Error registering user',
      },
      { status: 500 }
    );
  }
}