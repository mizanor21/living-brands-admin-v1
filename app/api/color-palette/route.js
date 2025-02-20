import { ColorPalate } from "@/app/lib/ColorPalate/model";
import { connectToDB } from "@/app/lib/connectToDB";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  const teams = await ColorPalate.find();
  const response = NextResponse.json(teams);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

export async function POST(req) {
  try {
    const ColorPalateData = await req.json();

    // Connect to the database
    await connectToDB();
    await ColorPalate.create(ColorPalateData);
    return NextResponse.json(
      { message: "ColorPalate data created" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating ColorPalate data:", error);
    return NextResponse.json(
      { message: "Failed to create ColorPalate data" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    await connectToDB();
    const deletedColorPalate = await ColorPalate.findByIdAndDelete(id);
    if (!deletedColorPalate) {
      return NextResponse.json(
        { message: "ColorPalate data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "ColorPalate data deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete ColorPalate data" },
      { status: 500 }
    );
  }
}
