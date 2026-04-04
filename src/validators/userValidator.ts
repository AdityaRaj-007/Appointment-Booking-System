import { z } from "zod";
import { Role } from "../generated/prisma/enums";

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string(),
  role: z.enum(Role),
});

export const loginUserSchema = z.object({
  email: z.email(),
  password: z.string(),
});
