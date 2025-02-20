import { connectToDB } from "@/app/lib/connectToDB";
import { Home } from "@/app/lib/Home/models";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const HomeData = await req.json();

    // Connect to the database
    await connectToDB();
    await Home.create(HomeData);
    return NextResponse.json({ message: "Home data created" }, { status: 201 });
  } catch (error) {
    console.error("Error creating Home data:", error);
    return NextResponse.json(
      { message: "Failed to create Home data" },
      { status: 500 }
    );
  }
}

export async function GET() {
  await connectToDB();
  const heroes = await Home.find();
  const response = NextResponse.json(heroes);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    await connectToDB();
    const deletedHero = await Home.findByIdAndDelete(id);
    if (!deletedHero) {
      return NextResponse.json(
        { message: "Hero data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Hero data deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete hero data" },
      { status: 500 }
    );
  }
}
