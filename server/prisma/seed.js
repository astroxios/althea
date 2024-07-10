import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {

        // Create widget type
        console.log('Creating widget type schedule...')
        const scheduleType = await prisma.widgetType.upsert({
            where: { name: 'SCHEDULE' },
            update: {},
            create: {
                name: 'Stream Schedule',
                description: 'Manage your stream schedule and notify yourself when there is about to be an active stream.'
            },
        });

        console.log('Widget type created:', scheduleType);

    } catch (e) {
        console.error('Error seeding data:', e);
    }
}

main()
    .catch(e => {
        console.error('Error in main:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
