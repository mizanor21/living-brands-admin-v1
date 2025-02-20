import { NextResponse } from "next/server";
import { BrandSolutions } from "../../lib/BrandSolutions/model";
import { connectToDB } from "../../lib/connectToDB";

export async function GET() {
  await connectToDB();
  const data = await BrandSolutions.find();
  const response = NextResponse.json(data);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

export async function POST(req) {
  try {
    const BrandSolutionsData = await req.json();

    // Connect to the database
    await connectToDB();
    await BrandSolutions.create(BrandSolutionsData);
    return NextResponse.json(
      { message: "BrandSolutions data created" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating BrandSolutions data:", error);
    return NextResponse.json(
      { message: "Failed to create BrandSolutions data" },
      { status: 500 }
    );
  }
}
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    await connectToDB();
    const deletedBrandSolutions = await BrandSolutions.findByIdAndDelete(id);
    if (!deletedBrandSolutions) {
      return NextResponse.json(
        { message: "BrandSolutions data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "BrandSolutions data deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete BrandSolutions data" },
      { status: 500 }
    );
  }
}
