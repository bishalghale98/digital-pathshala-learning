import dbConnect from "@/database/dbConnection";

export async function GET() {
  try {
    await dbConnect();
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
