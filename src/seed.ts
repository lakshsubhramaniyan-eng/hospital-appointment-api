import prisma from "./lib/prisma.js";

async function main(): Promise<void> {
  const drPriya = await prisma.doctor.upsert({
    where: { email: "priya.sharma@hospital.io" },
    update: {},
    create: {
      name: "Dr. Priya Sharma",
      specialty: "Cardiology",
      email: "priya.sharma@hospital.io",
    },
  });

  const drVikram = await prisma.doctor.upsert({
    where: { email: "vikram.rao@hospital.io" },
    update: {},
    create: {
      name: "Dr. Vikram Rao",
      specialty: "Neurology",
      email: "vikram.rao@hospital.io",
    },
  });

  const aditi = await prisma.patient.upsert({
    where: { email: "aditi@example.com" },
    update: {},
    create: {
      name: "Aditi Mehra",
      email: "aditi@example.com",
      phone: "9876543210",
      dateOfBirth: new Date("1990-04-12T00:00:00.000Z"),
    },
  });

  const rahul = await prisma.patient.upsert({
    where: { email: "rahul@example.com" },
    update: {},
    create: { name: "Rahul Singh", email: "rahul@example.com" },
  });

  await prisma.appointment.deleteMany({
    where: { patientId: { in: [aditi.id, rahul.id] } },
  });

  const firstAppointment = new Date();
  firstAppointment.setDate(firstAppointment.getDate() + 1);
  firstAppointment.setHours(10, 0, 0, 0);

  const secondAppointment = new Date(firstAppointment);
  secondAppointment.setDate(secondAppointment.getDate() + 1);
  secondAppointment.setHours(14, 30, 0, 0);

  await prisma.appointment.createMany({
    data: [
      {
        appointmentDate: firstAppointment,
        status: "scheduled",
        notes: "Annual cardiac checkup",
        patientId: aditi.id,
        doctorId: drPriya.id,
      },
      {
        appointmentDate: secondAppointment,
        status: "scheduled",
        patientId: rahul.id,
        doctorId: drVikram.id,
      },
    ],
  });

  console.log("Seed complete:");
  console.log(" Doctors:", 2);
  console.log(" Patients:", 2);
  console.log(" Appointments:", 2);
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
