const fs = require('fs');
const file = 'd:\\Kiaan Project\\clinic managment 2\\zHealthbackend\\src\\modules\\patient\\patient.controller.js';
let lines = fs.readFileSync(file, 'utf8').split('\n');

const varsToEmpty = [
  'inMemoryTreatmentPlans', 'inMemoryExercises', 'inMemoryOutcomesData', 
  'inMemoryOutcomeMeasures', 'inMemoryForms', 'inMemoryDocuments', 
  'inMemoryFundingAccounts', 'inMemoryAlerts', 'inMemoryClaimsHistory', 
  'inMemoryActiveShares', 'inMemoryPendingShareRequests', 'inMemoryPatientInvoices',
  'inMemoryPatientAchievements'
];

let inVar = null;
let newLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  let started = false;
  for (const v of varsToEmpty) {
    if (line.startsWith(`let ${v} = [`)) {
      inVar = v;
      newLines.push(`let ${v} = []`);
      started = true;
      break;
    }
  }
  
  if (started) continue;
  
  if (inVar) {
    if (line.startsWith(']')) {
      inVar = null;
    }
    continue;
  }
  
  newLines.push(line);
}

fs.writeFileSync(file, newLines.join('\n'));
console.log("Done removing dummy data arrays.");
