const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding subjects...');

    const subjects = [
        // CORE
        { name: 'English Language', type: 'CORE' },
        { name: 'Mathematics', type: 'CORE' },
        { name: 'Integrated Science', type: 'CORE' },
        { name: 'Social Studies', type: 'CORE' },
        // ELECTIVES
        { name: 'Religious and Moral Education', type: 'ELECTIVE' },
        { name: 'Computing', type: 'ELECTIVE' },
        { name: 'French', type: 'ELECTIVE' },
        { name: 'Ghanaian Language', type: 'ELECTIVE' },
        { name: 'Career Technology', type: 'ELECTIVE' },
        { name: 'Creative Art', type: 'ELECTIVE' },
    ];

    for (const subject of subjects) {
        await prisma.subject.upsert({
            where: { name: subject.name },
            update: {},
            create: subject,
        });
    }

    console.log('Seeding admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await prisma.user.upsert({
        where: { phoneNumber: '0000000000' },
        update: {},
        create: {
            phoneNumber: '0000000000',
            password: hashedPassword,
            fullName: 'System Admin',
            role: 'ADMIN',
        },
    });

    console.log('Seed complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
