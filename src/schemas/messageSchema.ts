import { z } from "zod"

export const messageValidation = z.object({
    content : z
    .string()
    .min(10,{message:"content must be of atleast 10 char"})
    .max(300,{message:"content must ne no more than 300 char"})
})