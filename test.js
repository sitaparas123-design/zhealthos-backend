const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const appts = await prisma.appointment.findMany({ orderBy: { id: 'desc' }, take: 3 });
  console.log('Appts:', JSON.stringify(appts, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
