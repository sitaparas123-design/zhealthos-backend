const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { email: 'suman@gmail.com' }
  });
  console.log(users);
}

main().catch(console.error).finally(() => prisma.$disconnect());
