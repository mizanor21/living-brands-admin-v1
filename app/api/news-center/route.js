import { connectToDB } from "@/app/lib/connectToDB";
import { News } from "@/app/lib/NewsCenter/model";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectToDB();
  const data = await News.find();
  const response = NextResponse.json(data);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}


export async function POST(req) {
  try {
    const data = await req.json();

    // Connect to the database
    await connectToDB();
    await News.create(data);
    return NextResponse.json({ message: "Data created" }, { status: 201 });
  } catch (error) {
    console.error("Error creating data:", error);
    return NextResponse.json(
      { message: "Failed to create data" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    await connectToDB();
    const deletedHero = await News.findByIdAndDelete(id);
    if (!deletedHero) {
      return NextResponse.json(
        { message: "News data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "News data deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete news data" },
      { status: 500 }
    );
  }
}
