import app from './app';
import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);
const prisma = new PrismaClient();

const PORT = process.env.PORT || 3000;

async function checkPendingMigrations() {
  try {
    const { stdout } = await execPromise('bunx prisma migrate status --schema=./prisma/schema.prisma');
    return stdout.includes('Database schema is not in sync with the Prisma schema.');
  } catch (error) {
    console.error('Error checking migration status:', error);
    throw error;
  }
}

async function applyMigrations() {
  try {
    console.log('Checking for pending migrations...');
    const hasPendingMigrations = await checkPendingMigrations();

    if (hasPendingMigrations) {
      console.log('Applying migrations...');
      await execPromise('bunx prisma migrate deploy');
      console.log('Migrations applied successfuly.');
    } else {
      console.log('No pending migrations.');
    }
  } catch(error) {
    console.error('Error applying migrations:', error);
    throw error;
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
