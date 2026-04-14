import { Request, Response } from "express";
import { prisma } from "../utils/prismaClient";
import { minToTime, timeToMin } from "../utils/timeUtils";
import { v4 as uuidv4 } from "uuid";

export const bookAppointment = async (req: Request, res: Response) => {
  try {
    const email = (req as any).email;
    const role = (req as any).role;

    if (!email) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Please create an account." });
    }

    if (role !== "USER") {
      return res.status(401).json({ error: "Unauthorized." });
    }
    const { slotId } = req.body;

    const [serviceId, date, time] = slotId.split("_");

    console.log(serviceId, date, time);

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return res.status(400).json({ error: "Service not available." });
    }

    if (service.providerId === user.id) {
      return res.status(400).json({ error: "Cannot book your own service." });
    }

    const dayOfSlot = new Date(date).getDay();

    const availabilities = await prisma.availability.findMany({
      where: { serviceId, dayOfWeek: dayOfSlot },
    });

    if (!availabilities) {
      return res
        .status(400)
        .json({ error: "Service not available for the day." });
    }

    let isServiceAvailableForTheTime = false;
    const serviceEndTime = minToTime(timeToMin(time) + service.durationMinutes);

    for (const availability of availabilities) {
      isServiceAvailableForTheTime =
        isServiceAvailableForTheTime ||
        (timeToMin(time) >= timeToMin(availability.startTime) &&
          timeToMin(time) <= timeToMin(availability.endTime) &&
          timeToMin(time) + service.durationMinutes <=
            timeToMin(availability.endTime));
    }

    if (!isServiceAvailableForTheTime) {
      return res
        .status(400)
        .json({ error: "Service is not available for the selected time." });
    }

    const bookingDate = new Date(date);

    const isSlotBooked = await prisma.appointment.findMany({
      where: { serviceId, date: bookingDate, status: "BOOKED", slotId },
    });

    console.log(isSlotBooked);

    if (isSlotBooked.length > 0) {
      return res.status(409).json({ error: "Slot already booked." });
    }

    const appointment = await prisma.appointment.create({
      data: {
        id: uuidv4(),
        userId: user.id,
        serviceId,
        date: bookingDate,
        startTime: time,
        endTime: serviceEndTime,
        slotId,
        status: "BOOKED",
      },
    });

    return res
      .status(201)
      .json({ id: appointment.id, slotId, status: appointment.status });
  } catch (err) {
    console.log("Error occurred while creating appointmeent: ", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};
export const getMyAppointments = async (req: Request, res: Response) => {
  try {
    const email = (req as any).email;
    const role = (req as any).role;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: "Unauthorized" });
    }

    const appointments = await prisma.appointment.findMany({
      where: { userId: user.id },
    });

    const bookedAppointments = [];

    for (const appointment of appointments) {
      const serviceId = appointment.serviceId;

      const service = await prisma.service.findUnique({
        where: { id: serviceId },
      });

      const appointmentData = {
        serviceName: service?.name,
        type: service?.type,
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
      };

      bookedAppointments.push(appointmentData);
    }

    return res.status(200).json({ bookedAppointments });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server error." });
  }
};
