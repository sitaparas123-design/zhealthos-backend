const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { role: 'PRACTITIONER' },
    select: { email: true, name: true, role: true }
  });
  console.log('Practitioners:', users);
}

main().catch(console.error).finally(() => prisma.$disconnect());
