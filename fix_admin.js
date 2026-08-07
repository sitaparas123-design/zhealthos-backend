const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.update({
    where: { email: 'admin@zhealth.com' },
    data: { name: 'Super Admin' }
  });
  console.log('Fixed Super Admin Name');
}

main().catch(console.error).finally(() => prisma.$disconnect());
