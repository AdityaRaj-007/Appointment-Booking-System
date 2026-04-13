import { Request, Response } from "express";
import { prisma } from "../utils/prismaClient";
import { v4 as uuidv4 } from "uuid";
import { Type } from "../generated/prisma/enums";

export const createService = async (req: Request, res: Response) => {
  const { name, type, durationMinutes } = req.body;
  const email = (req as any).email;
  const role = (req as any).role;
  console.log(email);

  if (role !== "SERVICE_PROVIDER") {
    return res.status(409).json({ error: "Cannot create a service." });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  const newService = await prisma.service.create({
    data: {
      id: uuidv4(),
      name,
      type,
      providerId: user.id,
      durationMinutes,
    },
  });
  console.log(newService);

  return res.status(200).json({
    id: newService.id,
    name: newService.name,
    type: newService.type,
    durationMinutes: newService.durationMinutes,
  });
};

export const setServiceAvailability = async (req: Request, res: Response) => {
  const { dayOfWeek, startTime, endTime } = req.body;
  const { serviceId } = req.params;
  const email = (req as any).email;
  const role = (req as any).role;

  if (!serviceId || typeof serviceId !== "string") {
    return res.status(404).json({ error: "Invalid service id." });
  }

  if (role !== "SERVICE_PROVIDER") {
    return res.status(403).json({ error: "Wrong role." });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ error: "User not found." });
  }

  const services = await prisma.service.findMany();

  const isServiceAvailable = services.find(
    (service) => service.id === serviceId,
  );

  if (!isServiceAvailable) {
    return res.status(404).json({ error: "Service not found" });
  }

  if (isServiceAvailable.providerId !== user.id) {
    return res
      .status(403)
      .json({ error: "Service does not belong to provider." });
  }

  const availabilities = await prisma.availability.findMany({
    where: { serviceId: isServiceAvailable.id, dayOfWeek: dayOfWeek },
  });

  const toMinutes = (time: any) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const isSlotAvailable = availabilities.find((availability) => {
    const start = toMinutes(startTime);
    const end = toMinutes(endTime);
    const availStart = toMinutes(availability.startTime);
    const availEnd = toMinutes(availability.endTime);

    return start < availEnd && end > availStart;
  });

  if (isSlotAvailable) {
    return res.status(409).json({ message: "Overelapping availability." });
  }

  const newAvailableSlot = await prisma.availability.create({
    data: {
      id: uuidv4(),
      serviceId,
      dayOfWeek,
      startTime,
      endTime,
    },
  });

  return res
    .status(201)
    .json({ message: "Service availability set successfully" });
};

export const getAllServicesByType = async (req: Request, res: Response) => {
  const { type: serviceType } = res.locals.query;
  console.log(serviceType);

  if (!serviceType || typeof serviceType !== "string") {
    return res.status(400).json({ error: "Invalid service type" });
  }

  if (!Object.values(Type).includes(serviceType as Type)) {
    return res.status(400).json({ error: "Invalid service type" });
  }

  try {
    console.log("Finding services.");
    const services = await prisma.service.findMany({
      where: { type: serviceType as Type },
      include: {
        user: {
          select: { name: true },
        },
      },
    });
    console.log(services);

    const availableServices = services.map((service) => ({
      id: service.id,
      name: service.name,
      type: service.type,
      durationInMinutes: service.durationMinutes,
      providerName: service.user.name,
    }));

    return res.status(200).json(availableServices);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error." });
  }
};
