import { Router } from "express";
import { createService } from "../controllers/serviceController";
import { validate } from "../middlewares/validationMiddleware";
import { createServiceSchema } from "../validators/serviceValidator";

const router = Router();

router.post("/", validate(createServiceSchema), createService);

export default router;
