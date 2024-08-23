import { z } from "zod"

export const verifyValidation = z.object({
    code: z.string().length(6,"the code should be 6 digit"),

})