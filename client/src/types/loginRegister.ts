import { z } from "zod"

export const loginSchema = z.object({
    // Username must be at least 3 characters long, and can only contain letters, numbers, and underscores
    emailOrUsername: 
    z.string()
    .trim()
    .regex(/^[a-zA-Z0-9_]+$/, "Invalid username.")
    .min(3, "Username must be at least 3 characters long.")
    .max(30, "Username must be less than 30 characters long.")
    .toLowerCase()
    .or(z.string().email("Invalid email address.").trim().toLowerCase()),
    password: z.string()
    .trim()
    .min(8, "Password must be at least 8 characters long.")
    .max(128, "Password must be less than 128 characters long.")
    .refine((val) => {
        // Check for at least one digit
        if (!/\d/.test(val)) return false;
      
        // Check for at least one lowercase letter
        if (!/[a-z]/.test(val)) return false;
      
        // Check for at least one uppercase letter
        if (!/[A-Z]/.test(val)) return false;
      
        // Check for at least one symbol
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(val)) return false;
      
        return true;
      }, "Password must include a number, uppercase and lowercase letters, and a symbol.")
})

export const registerSchema = z
    .object({
        email: z.string().email("Invalid email address.").trim().toLowerCase(),
        // Username must be at least 3 characters long, and can only contain letters, numbers, and underscores
        username: z.string()
        .trim()
        .regex(/^[a-zA-Z0-9_]+$/, "Invalid username.")
        .min(3, "Username must be at least 3 characters long.")
        .max(30, "Username must be less than 30 characters long.")
        .toLowerCase(),
        password: z.string()
        .trim()
        .min(8, "Password must be at least 8 characters long.")
        .max(128, "Password must be less than 128 characters long.")
        .refine((val) => {
            // Check for at least one digit
            if (!/\d/.test(val)) return false;
          
            // Check for at least one lowercase letter
            if (!/[a-z]/.test(val)) return false;
          
            // Check for at least one uppercase letter
            if (!/[A-Z]/.test(val)) return false;
          
            // Check for at least one symbol
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(val)) return false;
          
            return true;
          }, "Password must include a number, uppercase and lowercase letters, and a symbol."),
        confirmPassword: z.string()
    })
    .refine(data => data.password === data.confirmPassword, {
        message: "Passwords do not match.", path: ["confirmPassword"]
    })

export type TRegisterSchema = z.infer<typeof registerSchema>
export type TLoginSchema = z.infer<typeof loginSchema>
