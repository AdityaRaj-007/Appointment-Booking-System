import { z } from "zod";

export const bookAppointmentSchema = z.object({
  slotId: z.string().regex(/^[0-9a-fA-F-]{36}_\d{4}-\d{2}-\d{2}_\d{2}:\d{2}$/),
});
