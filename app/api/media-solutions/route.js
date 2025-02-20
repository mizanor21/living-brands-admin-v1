import { connectToDB } from "@/app/lib/connectToDB";
import { MediaSolutions } from "@/app/lib/MediaSolutions/model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  const data = await MediaSolutions.find();
  const response = NextResponse.json(data);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

export async function POST(req) {
  try {
    const mediaSolutionsData = await req.json();

    // Connect to the database
    await connectToDB();
    await MediaSolutions.create(mediaSolutionsData);
    return NextResponse.json(
      { message: "mediaSolutions data created" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating mediaSolutions data:", error);
    return NextResponse.json(
      { message: "Failed to create mediaSolutions data" },
      { status: 500 }
    );
  }
}
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    await connectToDB();
    const deletedMediaSolutions = await MediaSolutions.findByIdAndDelete(id);
    if (!deletedMediaSolutions) {
      return NextResponse.json(
        { message: "MediaSolutions data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "MediaSolutions data deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete MediaSolutions data" },
      { status: 500 }
    );
  }
}
