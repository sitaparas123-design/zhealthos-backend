const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const leads = await prisma.salesLead.findMany({
    where: { stage: { not: 'Converted' } }
  });
  if (leads.length > 0) {
    console.log('Found lead:', leads[0].id);
    const lead = leads[0];
    await prisma.salesLead.update({
      where: { id: lead.id },
      data: { stage: 'Converted', assignedTo: 'Colin Edegbe' }
    });
    await prisma.clinic.create({
      data: {
        name: lead.companyName || lead.name || 'New Clinic',
        email: lead.email || 'test@example.com',
        salesperson: 'Colin Edegbe',
        status: 'Active',
        tier: 'Basic',
        revenue: 100
      }
    });
    console.log('Converted successfully');
  } else {
    console.log('No leads found');
  }
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
