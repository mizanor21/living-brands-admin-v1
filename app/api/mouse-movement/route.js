import { NextResponse } from "next/server";
import { connectToDB } from "../../lib/connectToDB";
import { MouseMovement } from "@/app/lib/Home/mouseMovement";

export async function GET() {
  await connectToDB();
  const data = await MouseMovement.find();
  const response = NextResponse.json(data);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}
export async function POST(req) {
  try {
    // Parse incoming data
    const MouseMovementData = await req.json();

    // Validate required fields
    if (!MouseMovementData.title || !MouseMovementData.content) {
      return NextResponse.json(
        { message: "Title and Content are required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDB();

    // Create a new entry
    const newEntry = await MouseMovement.create(MouseMovementData);

    return NextResponse.json(
      { message: "MouseMovement data created", data: newEntry },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating MouseMovement data:", error);
    return NextResponse.json(
      { message: "Failed to create MouseMovement data", error: error.message },
      { status: 500 }
    );
  }
}
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    await connectToDB();
    const deletedMouseMovement = await MouseMovement.findByIdAndDelete(id);
    if (!deletedMouseMovement) {
      return NextResponse.json(
        { message: "MouseMovement data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "MouseMovement data deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete MouseMovement data" },
      { status: 500 }
    );
  }
}
