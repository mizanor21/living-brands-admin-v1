import { Achievements } from "@/app/lib/Achievements/model";
import { connectToDB } from "@/app/lib/connectToDB";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  const data = await Achievements.find();
  const response = NextResponse.json(data);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

export async function POST(req) {
  try {
    const {
      title,
      description,
      image,
      link,
      isActive = true,
    } = await req.json();

    // Connect to the database
    await connectToDB();

    // Create a new job document
    await Achievements.create({ title, description, image, link, isActive });

    return NextResponse.json(
      { message: "achievement created" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating achievement:", error);
    return NextResponse.json(
      { message: "Failed to create achievement" },
      { status: 500 }
    );
  }
}
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    await connectToDB();
    const deletedAchievement = await Achievements.findByIdAndDelete(id);
    if (!deletedAchievement) {
      return NextResponse.json(
        { message: "Achievement data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Achievement data deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete Achievement data" },
      { status: 500 }
    );
  }
}
