import { Prisma } from "../generated/prisma/client.js";
import prisma from "./lib/prisma.js";

export interface CreateDoctorInput {
  name: string;
  specialty: string;
  email: string;
}

export async function createDoctor(data: CreateDoctorInput) {
  return prisma.doctor.create({ data });
}

export async function getDoctor(id: number) {
  const doctor = await prisma.doctor.findUnique({ where: { id } });
  if (doctor === null) {
    throw new Error(`Doctor ${id} not found`);
  }
  return doctor;
}

export async function listDoctorsBySpecialty(specialty: string) {
  return prisma.doctor.findMany({
    where: { specialty: { contains: specialty, mode: "insensitive" } },
    orderBy: { name: "asc" },
    select: { id: true, name: true, specialty: true, email: true },
  });
}

export async function deleteDoctor(id: number) {
  try {
    return await prisma.doctor.delete({ where: { id } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      throw new Error(
        `Cannot delete doctor ${id} while appointments still reference them`,
        { cause: error },
      );
    }
    throw error;
  }
}
