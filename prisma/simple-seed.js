const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Inserting initial data...');

    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await prisma.user.create({
            data: {
                phoneNumber: '0000000000',
                password: hashedPassword,
                fullName: 'System Admin',
                role: 'ADMIN',
            },
        });
        console.log('Admin created.');
    } catch (e) {
        console.log('Admin might already exist.');
    }

    const subjects = ['English Language', 'Mathematics', 'Integrated Science', 'Social Studies'];
    for (const name of subjects) {
        try {
            await prisma.subject.create({ data: { name, type: 'CORE' } });
            console.log(`Created ${name}`);
        } catch (e) {
            console.log(`${name} already exists.`);
        }
    }
}

main().finally(() => prisma.$disconnect());
