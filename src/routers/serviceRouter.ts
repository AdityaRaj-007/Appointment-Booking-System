import { Router } from "express";
import {
  createService,
  getAllServicesByType,
  setServiceAvailability,
} from "../controllers/serviceController";
import { validate } from "../middlewares/validationMiddleware";
import {
  createServiceSchema,
  getServiceSchema,
  setServiceAvailabilitySchema,
} from "../validators/serviceValidator";

const router = Router();

router.post("/", validate({ body: createServiceSchema }), createService);
router.post(
  "/:serviceId/availability",
  validate({ body: setServiceAvailabilitySchema }),
  setServiceAvailability,
);
router.get("/", validate({ query: getServiceSchema }), getAllServicesByType);

export default router;
