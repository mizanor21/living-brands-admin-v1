import { connectToDB } from "@/app/lib/connectToDB";
import { WhoWeAre } from "@/app/lib/WhoWeAre/model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  const teams = await WhoWeAre.find();
  const response = NextResponse.json(teams);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

export async function POST(req) {
  try {
    const WhoWeAreData = await req.json();

    // Connect to the database
    await connectToDB();
    await WhoWeAre.create(WhoWeAreData);
    return NextResponse.json(
      { message: "WhoWeAre data created" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating WhoWeAre data:", error);
    return NextResponse.json(
      { message: "Failed to create WhoWeAre data" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    await connectToDB();
    const deletedWhoWeAre = await WhoWeAre.findByIdAndDelete(id);
    if (!deletedWhoWeAre) {
      return NextResponse.json(
        { message: "WhoWeAre data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "WhoWeAre data deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete WhoWeAre data" },
      { status: 500 }
    );
  }
}
