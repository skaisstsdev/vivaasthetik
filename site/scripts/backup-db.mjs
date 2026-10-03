// Read-only JSON backup of all tables to ../backups/ (gitignored — contains client data).
//   node scripts/backup-db.mjs

import { PrismaClient } from '@prisma/client';
import { mkdirSync, writeFileSync } from 'fs';

const prisma = new PrismaClient();

// Raw SELECT * so the backup works both before and after the schema change
// (the generated client would ask for columns that may not exist yet).
const dump = table => prisma.$queryRawUnsafe(`SELECT * FROM "${table}"`);

const data = {
  exportedAt: new Date().toISOString(),
  Booking: await dump('Booking'),
  WorkingDay: await dump('WorkingDay'),
  BlockedPeriod: await dump('BlockedPeriod'),
  DateException: await dump('DateException'),
};

mkdirSync('../backups', { recursive: true });
const file = `../backups/viva_db_${data.exportedAt.slice(0, 19).replace(/[:T]/g, '-')}.json`;
writeFileSync(file, JSON.stringify(data, null, 2), { mode: 0o600 });

console.log(`Saved ${file}`);
for (const k of ['Booking', 'WorkingDay', 'BlockedPeriod', 'DateException']) console.log(`  ${k}: ${data[k].length} rows`);
await prisma.$disconnect();
