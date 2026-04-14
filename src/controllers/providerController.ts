import { Request, Response } from "express";
import { prisma } from "../utils/prismaClient";

export const getProviderSchedule = async (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    const email = (req as any).email;
    const role = (req as any).role;

    if (role != "SERVICE_PROVIDER") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!date || typeof date !== "string") {
      return res.status(400).json({ error: "Please select a date." });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: "Please create an account." });
    }

    const services = await prisma.service.findMany({
      where: { providerId: user.id },
    });

    const bookingDate = new Date(date);

    const schedule = { date, services: [] as any };

    for (const service of services) {
      const appointments = await prisma.appointment.findMany({
        where: { serviceId: service.id },
      });

      const serviceAppointments = [];

      for (const appointment of appointments) {
        const user = await prisma.user.findUnique({
          where: { id: appointment.userId },
        });

        const appointmentData = {
          appointmentId: appointment.id,
          userName: user?.name,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
          status: appointment.status,
        };

        serviceAppointments.push(appointmentData);
      }

      const serviceData = {
        serviceId: service.id,
        serviceName: service.name,
        appointments: serviceAppointments,
      };

      schedule.services.push(serviceData);
    }

    return res.status(200).json(schedule);
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
