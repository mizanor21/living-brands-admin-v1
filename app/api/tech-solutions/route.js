import { connectToDB } from "@/app/lib/connectToDB";
import { TechSolutions } from "@/app/lib/TechSolutions/model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  const data = await TechSolutions.find();
  const response = NextResponse.json(data);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

export async function POST(req) {
  try {
    const techSolutionsData = await req.json();

    // Connect to the database
    await connectToDB();
    await TechSolutions.create(techSolutionsData);
    return NextResponse.json(
      { message: "techSolutions data created" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating techSolutions data:", error);
    return NextResponse.json(
      { message: "Failed to create techSolutions data" },
      { status: 500 }
    );
  }
}
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    await connectToDB();
    const deletedTechSolutions = await TechSolutions.findByIdAndDelete(id);
    if (!deletedTechSolutions) {
      return NextResponse.json(
        { message: "TechSolutions data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "TechSolutions data deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete TechSolutions data" },
      { status: 500 }
    );
  }
}
