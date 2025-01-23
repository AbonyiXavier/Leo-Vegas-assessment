import { z } from 'zod';
import { UserRole } from '../constant';

export const signInSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6).max(20),
  })
  .strict();

export type SignIn = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6).max(20),
    role: z.nativeEnum(UserRole),
  })
  .strict();

export type SignUp = z.infer<typeof signUpSchema>;

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6).max(20),
    newPassword: z.string().min(6).max(20),
  })
  .strict();

export type ChangePassword = z.infer<typeof changePasswordSchema>;

export const updateUserSchema = z
  .object({
    name: z.string(),
    role: z.nativeEnum(UserRole),
  })
  .partial();

export type UpdateUserDto = z.infer<typeof updateUserSchema>;

export const userIdSchema = z.string();
