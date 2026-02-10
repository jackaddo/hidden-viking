import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
    const teachers = await prisma.user.findMany({
        where: { role: "TEACHER" },
        orderBy: { fullName: "asc" },
    });
    return NextResponse.json({ teachers });
}

export async function POST(req: Request) {
    try {
        const { fullName, phoneNumber, password } = await req.json();

        const hashedPassword = await bcrypt.hash(password, 10);

        const teacher = await prisma.user.create({
            data: {
                fullName,
                phoneNumber,
                password: hashedPassword,
                role: "TEACHER",
            },
        });

        return NextResponse.json(teacher);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
