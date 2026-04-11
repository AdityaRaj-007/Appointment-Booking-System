import { z } from "zod";
import { Type } from "../generated/prisma/enums";

export const createServiceSchema = z.object({
  name: z.string(),
  type: z.enum(Type),
  durationMinutes: z.number().min(30).max(120),
});
