import type { Request, Response } from "express";
import { prisma } from "../utils/prismaClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    return res.status(409).json({ error: "User already exists." });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashedPassword,
      role,
    },
  });

  return res
    .status(201)
    .json({ message: `User created Successfully with id ${newUser.id}` });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  const token = jwt.sign({ email, role: user.role }, JWT_SECRET);

  if (isMatch) {
    return res.status(200).json({ token });
  } else {
    return res.status(401).json({ error: "Invalid Credentials" });
  }
};
