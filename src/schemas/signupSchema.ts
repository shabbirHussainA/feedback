import { z } from "zod";

export const usernameValidation = z.string()
    .min(2,"username should have more char")
    .max(20,"username should no more than 20")
    .regex(/^[a-zA-Z0-9_]+$/,"username must not contain soecial character")