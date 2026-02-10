import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    const candidates = await prisma.candidate.findMany({
        include: {
            scores: {
                include: {
                    subject: true
                }
            }
        },
        orderBy: { surname: "asc" }
    });
    return NextResponse.json({ candidates });
}
