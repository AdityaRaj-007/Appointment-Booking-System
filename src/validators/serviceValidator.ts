import { z } from "zod";
import { Type } from "../generated/prisma/enums";

export const createServiceSchema = z.object({
  name: z.string(),
  type: z.enum(Type),
  durationMinutes: z.number().min(30).max(120),
});

export const setServiceAvailabilitySchema = z.object({
  dayOfWeek: z.number(),
  startTime: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):[0-5]\d$/,
      "Invalid time format. Expected HH:MM (24h)",
    ),
  endTime: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):[0-5]\d$/,
      "Invalid time format. Expected HH:MM (24h)",
    ),
});

export const getServiceSchema = z.object({
  type: z.enum(Type),
});

export const getServiceSlotSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
