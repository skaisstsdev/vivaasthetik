// One-off: convert legacy BlockedPeriod rows into DateException rows (one per day,
// sharing a groupId) so the admin shows them as periods. Days that already have
// an exception are skipped — matching the old precedence (exception > period).
// Safe to re-run: periods already migrated are detected by their groupId.
//
//   node scripts/migrate-blocked-periods.mjs          # dry run
//   node scripts/migrate-blocked-periods.mjs --apply  # write

import { PrismaClient } from '@prisma/client';

const apply = process.argv.includes('--apply');
const prisma = new PrismaClient();

function datesInRange(start, end) {
  const out = [];
  const cur = new Date(`${start}T12:00:00Z`);
  const last = new Date(`${end}T12:00:00Z`);
  while (cur <= last) {
    out.push(cur.toISOString().slice(0, 10));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
}

const periods = await prisma.blockedPeriod.findMany();
console.log(`Legacy periods: ${periods.length}`);

for (const p of periods) {
  const groupId = `legacy-${p.id}`;
  if (await prisma.dateException.findFirst({ where: { groupId } })) {
    console.log(`  ${p.startDate} – ${p.endDate}: already migrated`);
    continue;
  }
  const dates = datesInRange(p.startDate, p.endDate);
  const existing = new Set(
    (await prisma.dateException.findMany({ where: { date: { in: dates } }, select: { date: true } })).map(e => e.date),
  );
  const toCreate = dates.filter(d => !existing.has(d));
  console.log(`  ${p.startDate} – ${p.endDate}: ${toCreate.length} days to close, ${existing.size} skipped (already special)`);
  if (apply && toCreate.length) {
    await prisma.dateException.createMany({
      data: toCreate.map(date => ({ date, isWorking: false, blockedHours: [], note: 'Отпуск', groupId })),
    });
  }
}

console.log(apply ? 'Done.' : 'Dry run — nothing written. Re-run with --apply.');
await prisma.$disconnect();
