import app from './app';
import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);
const prisma = new PrismaClient();

const PORT = process.env.PORT || 3000;

async function applyMigrations() {
  try {
    console.log('Applying migrations...');
    await execPromise('bunx prisma migrate deploy');
    console.log('Migrations applied successfuly.');
  } catch(error) {
    console.error('Error applying migrations:', error);
  }
}

async function main() {
  await applyMigrations();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  })
