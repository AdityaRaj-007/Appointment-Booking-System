import { NextFunction, Response, Request } from "express";
import { ZodType } from "zod";

type ValidationSchema = {
  body?: ZodType<any>;
  query?: ZodType<any>;
};

export const validate =
  (schemas: ValidationSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (schemas.body) {
      const bodyResult = schemas.body.safeParse(req.body);
      if (!bodyResult.success) {
        return res.status(400).json({
          error: bodyResult.error.issues,
        });
      }
      req.body = bodyResult.data;
    }

    if (schemas.query) {
      const queryResult = schemas.query.safeParse(req.query);
      if (!queryResult.success) {
        return res.status(400).json({
          error: queryResult.error.issues,
        });
      }
      console.log(queryResult);
      res.locals.query = queryResult.data;
    }

    next();
  };
