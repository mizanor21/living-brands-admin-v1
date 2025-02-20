import { connectToDB } from "@/app/lib/connectToDB";
import { Slideshow } from "@/app/lib/Slideshow/model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  const data = await Slideshow.find();
  const response = NextResponse.json(data);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

export async function POST(req) {
  try {
    const data = await req.json();

    // Connect to the database
    await connectToDB();
    await Slideshow.create(data);
    return NextResponse.json({ message: "Slideshow data created" }, { status: 201 });
  } catch (error) {
    console.error("Error creating slideshow data:", error);
    return NextResponse.json(
      { message: "Failed to create slideshow data" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    await connectToDB();
    const data = await Slideshow.findByIdAndDelete(id);
    if (!data) {
      return NextResponse.json(
        { message: "Data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Data deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete data" },
      { status: 500 }
    );
  }
}
