import { Router } from "express";
import {
  bookAppointment,
  getMyAppointments,
} from "../controllers/appointmentController";
import { validate } from "../middlewares/validationMiddleware";
import { bookAppointmentSchema } from "../validators/appointmentValidator";

const router = Router();

router.post("/", validate({ body: bookAppointmentSchema }), bookAppointment);
router.get("/me", getMyAppointments);

export default router;
