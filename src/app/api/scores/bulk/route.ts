import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { subjectId, scores } = await req.json();

    // MockExamID - for now let's assume a default mock or create one if none exists
    let mockExam = await prisma.mockExam.findFirst();
    if (!mockExam) {
      mockExam = await prisma.mockExam.create({
        data: { name: "Mock 1 2024" }
      });
    }

    const operations = scores.map((s: any) => 
      prisma.score.upsert({
        where: {
          candidateId_subjectId_mockExamId: {
            candidateId: s.candidateId,
            subjectId,
            mockExamId: mockExam!.id
          }
        },
        update: { score: s.score },
        create: {
          score: s.score,
          candidateId: s.candidateId,
          subjectId,
          mockExamId: mockExam!.id
        }
      })
    );

    await prisma.$transaction(operations);

    return NextResponse.json({ message: "Scores updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
