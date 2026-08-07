const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
  // Check service_items table
  const services = await p.serviceItem.findMany({ orderBy: { createdAt: 'desc' } })
  console.log('\n=== service_items table ===')
  console.log('Total records:', services.length)
  if (services.length > 0) {
    services.forEach(s => console.log(` [${s.id.slice(0,8)}] "${s.name}" price=${s.price} duration=${s.duration} archived=${s.archived}`))
  }

  // Check cancellation_reasons table  
  const reasons = await p.cancellationReason.findMany()
  console.log('\n=== cancellation_reasons table ===')
  console.log('Total records:', reasons.length)
  reasons.forEach(r => console.log(` [${r.id.slice(0,8)}] "${r.reason}"`))

  // Check client_tags table
  try {
    const tags = await p.clientTag.findMany()
    console.log('\n=== client_tags table ===')
    console.log('Total records:', tags.length)
    tags.forEach(t => console.log(` [${t.id.slice(0,8)}] "${t.name}" color=${t.color}`))
  } catch(e) {
    console.log('\n=== client_tags table === ERROR:', e.message)
  }
}

main().catch(e => console.error('ERROR:', e.message)).finally(() => p.$disconnect())
