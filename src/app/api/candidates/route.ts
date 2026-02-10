import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    const candidates = await prisma.candidate.findMany({
        orderBy: { indexNumber: "asc" },
    });
    return NextResponse.json({ candidates });
}

export async function POST(req: Request) {
    try {
        const { firstName, surname, dob } = await req.json();

        // Generate Candidate Index Number
        // Logic: Fixed prefix 0106188 + Three-digit auto-incrementing number (001, 002...)
        const lastCandidate = await prisma.candidate.findFirst({
            orderBy: { indexNumber: "desc" },
        });

        let nextNumber = 1;
        if (lastCandidate) {
            const lastIndex = lastCandidate.indexNumber.slice(-3);
            nextNumber = parseInt(lastIndex) + 1;
        }

        const indexNumber = `0106188${nextNumber.toString().padStart(3, "0")}`;

        const candidate = await prisma.candidate.create({
            data: {
                firstName,
                surname,
                dob: new Date(dob),
                indexNumber,
            },
        });

        return NextResponse.json(candidate);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
