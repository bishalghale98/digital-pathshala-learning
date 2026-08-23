import prisma from "@/database/prisma";

export async function GET() {
  try {
    await prisma.$connect();
    return Response.json(
      {
        message: "API is working",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        message: "API isn't working",
      },
      { status: 500 }
    );
  }
}
