import { connectToDB } from "@/app/lib/connectToDB";
import { Teams } from "@/app/lib/Teams/model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  const data = await Teams.find();
  const response = NextResponse.json(data);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

export async function POST(req) {
  try {
    const { id, image, name, title, isActive = true } = await req.json();

    // Connect to the database
    await connectToDB();

    // Create a new job document
    await Teams.create({ id, image, name, title, isActive });

    return NextResponse.json({ message: "team data created" }, { status: 201 });
  } catch (error) {
    console.error("Error creating team data:", error);
    return NextResponse.json(
      { message: "Failed to create team data" },
      { status: 500 }
    );
  }
}
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    await connectToDB();
    const deletedTeam = await Teams.findByIdAndDelete(id);
    if (!deletedTeam) {
      return NextResponse.json(
        { message: "Team data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "team data deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete team data" },
      { status: 500 }
    );
  }
}
