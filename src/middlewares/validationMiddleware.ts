import { NextFunction, Response, Request } from "express";
import { ZodType } from "zod";

export const validate =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    console.log(result);

    if (!result.success) {
      return res.status(400).json({ error: "Invalid input" });
    }

    req.body = result.data;
    next();
  };
