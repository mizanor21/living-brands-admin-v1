import { connectToDB } from "@/app/lib/connectToDB";
import { Edge } from "@/app/lib/Edge/model";
import { Teams } from "@/app/lib/Teams/model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  const teams = await Edge.find();
  const response = NextResponse.json(teams);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

export async function POST(req) {
  try {
    const edgeData = await req.json();

    // Connect to the database
    await connectToDB();
    await Edge.create(edgeData);
    return NextResponse.json({ message: "Edge data created" }, { status: 201 });
  } catch (error) {
    console.error("Error creating edge data:", error);
    return NextResponse.json(
      { message: "Failed to create edge data" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    await connectToDB();
    const deletedEdge = await Edge.findByIdAndDelete(id);
    if (!deletedEdge) {
      return NextResponse.json(
        { message: "Edge data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "edge data deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete edge data" },
      { status: 500 }
    );
  }
}
