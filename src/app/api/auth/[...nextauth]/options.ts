import { NextAuthOptions } from "next-auth";
import dbConnect from "@/lib/dbCOnnect";
import UserModal from "@/models/User.model";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import Email from "next-auth/providers/email";

export const authOptions:NextAuthOptions = {
    //it is for adding auth options
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"credentials",
            credentials:{
                email: { label: "email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any, req):Promise<any> {
                await dbConnect() //connect to database
                try {
                  const user = await UserModal.findOne({
                        $or:[
                            {username:credentials.identifier},{password:credentials.identifier}
                        ]
                    })
                    if(!user){
                        throw new Error("the user doesnot exist");
                    }
                   if(!user.isVerified){
                    throw new Error("please verify your account first");
                   }
                   const ispasswordCorrect = await bcrypt.compare(user.password,credentials.password)
                   if(ispasswordCorrect){
                    return user
                   }else{
                    throw new Error("incorrect Password");
                   }
                } catch (error:any) {
                    throw new Error(error);
                }
            }
        }),
    ],
    // it is used for modifying the session and Jwt
    callbacks:{
        async jwt({ token, user }) {
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user?.isVerified;
                token.isAcceptingMessages = user?.isAcceptingMessages;
                token.username = user?.username;
                
            }
        return token
        },
        async session({ session, token }) {
            if (token) {
              session.user._id = token._id;
              session.user.isVerified = token.isVerified;
              session.user.isAcceptingMessages = token.isAcceptingMessages;
              session.user.username = token.username;
            }
            return session;
          },
        },
    // it is used for creting pages
    pages: {
        signIn: '/sign-in',
    },
    // it is used for declaring who will get the session those who have jwt
    session:{
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET_KEY,
}