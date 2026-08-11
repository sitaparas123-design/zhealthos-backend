const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { role: 'PATIENT' },
    select: { email: true, name: true, phone: true }
  });
  console.log('Patients in DB:', users);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
