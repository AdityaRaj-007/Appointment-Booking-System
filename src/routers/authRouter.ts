import { Router } from "express";
import { loginUser, registerUser } from "../controllers/authController";
import { validate } from "../middlewares/validationMiddleware";
import { createUserSchema, loginUserSchema } from "../validators/userValidator";

const router = Router();

router.post("/register", validate(createUserSchema), registerUser);

router.post("/login", validate(loginUserSchema), loginUser);

export default router;
