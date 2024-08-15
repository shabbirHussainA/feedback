import { z } from "zod";

export const usernameValidation = z.string()
    .min(2,"username should have more char")
    .max(20,"username should no more than 20")
    .regex(/^[a-zA-Z0-9_]+$/,"username must not contain social character")

export const signUpValidation = z.object({
    username: usernameValidation,
    email: z.string().email({message:"invalid email address"}),
    password: z.string().min(6,{message:"password should be atleast 6 characters"})
})