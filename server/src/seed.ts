import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const permissions = await prisma.permission.createMany({
        data: [
            { name: 'CREATE_USER' },
            { name: 'READ_USER' },
            { name: 'UPDATE_USER' },
            { name: 'DELETE_USER' },

            // NOTE: Add more permissions (as the application grows)
        ],
        skipDuplicates: true,
    });

    const roles = await prisma.role.createMany({
        data: [
            { name: 'admin' },
            { name: 'streamer' },
            { name: 'follower' },
        ],
        skipDuplicates: true,
    });

    const adminRole = await prisma.role.findUnique({
        where: { name: 'admin' },
    });

    const streamerRole = await prisma.role.findUnique({
        where: { name: 'streamer' },
    });

    const followerRole = await prisma.role.findUnique({
        where: { name: 'follower' },
    });

    const readUserPermission = await prisma.permission.findUnique({
        where: { name: 'READ_USER' },
    });

    const createUserPermission = await prisma.permission.findUnique({
        where: { name: 'CREATE_USER' },
    });

    const updateUserPermission = await prisma.permission.findUnique({
        where: { name: 'UPDATE_USER' },
    });

    const deleteUserPermission = await prisma.permission.findUnique({
        where: { name: 'DELETE_USER' },
    });

    // NOTE: Full CRUD operations should apply only to admin (no other role)
    // FIXME: Check users' role before 'readUser, updateUser, deleteUser'

    await prisma.role.update({
        where: { id: adminRole?.id },
        data: {
            permissions: {
                connect: [
                    { id: readUserPermission?.id },
                    { id: createUserPermission?.id },
                    { id: updateUserPermission?.id },
                    { id: deleteUserPermission?.id },
                ],
            },
        },
    }),

    await prisma.role.update({
        where: { id: streamerRole?.id },
        data: {
            permissions: {
                connect: [
                    { id: readUserPermission?.id },
                ],
            },
        },
    }),

    await prisma.role.update({
        where: { id: followerRole?.id },
        data: {
            permissions: {
                connect: [
                    { id: readUserPermission?.id },
                ],
            },
        },
    })
}

main()
    .catch((error) => console.log(error))
    .finally(async () => {
        await prisma.$disconnect();
    });
