const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const clinic = await prisma.clinic.findFirst();
  if (!clinic) return console.log("No clinic found!");

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  let user = await prisma.user.findUnique({ where: { email: 'doctor@zhealth.com' } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'doctor@zhealth.com',
        name: 'Dr. Ramesh',
        passwordHash,
        role: 'PRACTITIONER',
        status: 'ACTIVE'
      }
    });
  }

  let prac = await prisma.practitioner.findFirst({ where: { userId: user.id } });
  if (!prac) {
    prac = await prisma.practitioner.create({
      data: {
        userId: user.id,
        clinicId: clinic.id,
        displayId: 'PRAC-000001',
        name: 'Dr. Ramesh',
        email: 'doctor@zhealth.com',
        specialization: 'Physiotherapist',
        specialty: 'Physiotherapy',
        status: 'ACTIVE'
      }
    });
  }

  console.log('Doctor created! Email: doctor@zhealth.com | Password: password123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
