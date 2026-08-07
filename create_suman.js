const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const clinic = await prisma.clinic.findFirst();
  if (!clinic) return console.log("No clinic found!");

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);
  const email = 'suman@gmail.com';

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: 'Suman',
        passwordHash,
        role: 'PRACTITIONER',
        status: 'ACTIVE'
      }
    });
  } else {
    // Force update password
    user = await prisma.user.update({
      where: { email },
      data: { passwordHash }
    });
  }

  let prac = await prisma.practitioner.findFirst({ where: { email } });
  if (!prac) {
    prac = await prisma.practitioner.create({
      data: {
        userId: user.id,
        clinicId: clinic.id,
        displayId: 'PRAC-SUMAN',
        name: 'Suman',
        email,
        specialization: 'Chiropractor',
        specialty: 'Chiropractor',
        status: 'ACTIVE'
      }
    });
  } else {
    // Ensure linked to user
    await prisma.practitioner.update({
      where: { id: prac.id },
      data: { userId: user.id }
    });
  }

  console.log('Suman created successfully!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
