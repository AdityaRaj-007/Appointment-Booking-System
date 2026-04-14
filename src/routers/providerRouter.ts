import { Router } from "express";
import { getProviderSchedule } from "../controllers/providerController";

const router = Router();

router.get("/me/schedule", getProviderSchedule);

export default router;
