import { connectToDB } from "@/app/lib/connectToDB";
import { Partnership } from "@/app/lib/partnership/model";
import { Teams } from "@/app/lib/Teams/model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  const data = await Partnership.find();

  const response = NextResponse.json(data);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

export async function POST(req) {
  try {
    const partnershipData = await req.json();

    // Connect to the database
    await connectToDB();
    await Partnership.create(partnershipData);
    return NextResponse.json(
      { message: "partnership data created" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating partnership data:", error);
    return NextResponse.json(
      { message: "Failed to create partnership data" },
      { status: 500 }
    );
  }
}
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    await connectToDB();
    const deletedPartnership = await Partnership.findByIdAndDelete(id);
    if (!deletedPartnership) {
      return NextResponse.json(
        { message: "Partnership data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Partnership data deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete Partnership data" },
      { status: 500 }
    );
  }
}
