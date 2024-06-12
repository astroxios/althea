import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        // Create user
        console.log('Creating user...');
        const user = await prisma.user.create({
            data: {
                email: 'test_user@example.com',
                username: 'test_user',
                password: 'password123',
            },
        });

        console.log('User created:', user);

        // Create widget type
        console.log('Creating widget type schedule...')
        const scheduleType = await prisma.widgetType.upsert({
            where: { name: 'SCHEDULE' },
            update: {},
            create: {
                name: 'Streaming Schedules',
                description: 'Manage your stream schedules and notify viewers when there is an active stream.'
            },
        });

        console.log('Widget type created:', scheduleType);

        // Create widget
        console.log('Creating a schedule widget...')
        const scheduleWidget = await prisma.widget.create({
            data: {
                name: 'Test Schedule',
                type: { connect: { id: scheduleType.id } },
            },
        });

        console.log('Widget created:', scheduleWidget);

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
