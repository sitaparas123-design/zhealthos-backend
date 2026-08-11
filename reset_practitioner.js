const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const newPassword = '12345678';
  const hash = await bcrypt.hash(newPassword, 10);

  // Update Doctor
  await prisma.user.updateMany({
    where: { 
      email: { in: ['doctor@zhealth.com', 'suman@gmail.com'] } 
    },
    data: { passwordHash: hash }
  });

  console.log('Practitioner passwords successfully reset to 12345678');
}

main().catch(console.error).finally(() => prisma.$disconnect());
