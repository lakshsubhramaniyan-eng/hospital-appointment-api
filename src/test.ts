import prisma from "./lib/prisma.js";
import {
  bookAppointment,
  cancelAllPatientAppointments,
  deleteAppointment,
  getAppointmentFull,
  getDoctorUpcomingAppointments,
  setAppointmentStatus,
} from "./appointments.js";
import {
  createDoctor,
  deleteDoctor,
  getDoctor,
  listDoctorsBySpecialty,
} from "./doctors.js";
import {
  createPatient,
  deletePatient,
  getPatient,
  searchPatients,
  updatePatientPhone,
} from "./patients.js";

async function main(): Promise<void> {
  console.log("\n── Patients ──────────────────────────");

  const patient = await createPatient({
    name: "Test Patient",
    email: `test.patient.${Date.now()}@example.com`,
    phone: "9999999999",
  });
  console.log("Created:", patient.name, patient.id);

  const foundPatient = await getPatient(patient.id);
  console.log("Found:", foundPatient.name);

  const updatedPatient = await updatePatientPhone(patient.id, "8888888888");
  console.log("Updated phone:", updatedPatient.phone);

  const patientResults = await searchPatients("Test Patient");
  console.log("Search results:", patientResults.length);

  console.log("\n── Doctors ───────────────────────────");

  const doctor = await createDoctor({
    name: "Dr. Test",
    specialty: "General Medicine",
    email: `dr.test.${Date.now()}@hospital.io`,
  });
  console.log("Created:", doctor.name, doctor.id);

  const foundDoctor = await getDoctor(doctor.id);
  console.log("Found:", foundDoctor.name);

  const specialists = await listDoctorsBySpecialty("General");
  console.log("General Medicine doctors:", specialists.length);

  console.log("\n── Appointments ──────────────────────");

  const appointmentDate = new Date();
  appointmentDate.setDate(appointmentDate.getDate() + 2);
  const appointment = await bookAppointment(
    patient.id,
    doctor.id,
    appointmentDate,
    "Initial consultation",
  );
  console.log("Booked:", appointment.id, "for", appointment.patient.name);

  const fullAppointment = await getAppointmentFull(appointment.id);
  console.log(
    "Full fetch:",
    fullAppointment.patient.name,
    "with",
    fullAppointment.doctor.name,
  );

  const schedule = await getDoctorUpcomingAppointments(doctor.id);
  console.log("Doctor schedule:", schedule.length, "appointment(s)");

  const secondAppointment = await bookAppointment(
    patient.id,
    doctor.id,
    new Date(appointmentDate.getTime() + 60 * 60 * 1000),
    "Follow-up consultation",
  );

  const updatedAppointment = await setAppointmentStatus(
    appointment.id,
    "completed",
  );
  console.log("Status updated to:", updatedAppointment.status);

  const cancelledCount = await cancelAllPatientAppointments(patient.id);
  console.log("Cancelled scheduled appointments:", cancelledCount);

  try {
    await deleteDoctor(doctor.id);
    throw new Error("Expected deleting a doctor with appointments to fail");
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.startsWith("Cannot delete doctor")
    ) {
      console.log("Restricted doctor deletion handled.");
    } else {
      throw error;
    }
  }

  console.log("\n── Cleanup ───────────────────────────");
  await deleteAppointment(appointment.id);
  await deleteAppointment(secondAppointment.id);
  await deletePatient(patient.id);
  await deleteDoctor(doctor.id);
  console.log("Test data cleaned up.");
}

main()
  .catch((error: unknown) => {
    console.error("CRUD test failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
