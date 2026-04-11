import { Request, Response } from "express";

export const createService = (req: Request, res: Response) => {
  const { name, type, durationMinutes } = req.body;
  const email = (req as any).email;
  const role = (req as any).role;
  console.log(name);
  console.log(type);
  console.log(durationMinutes);
  console.log(email);
  console.log(role);
  return res.status(200).json({ message: "Sevice created successfully" });
};
