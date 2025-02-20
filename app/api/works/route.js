import { connectToDB } from "@/app/lib/connectToDB";
import { Works } from "@/app/lib/Works/model";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectToDB();
  const data = await Works.find();
  const response = NextResponse.json(data);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

export async function POST(req) {
  try {
    const {
      title,
      detailsTitle,
      thumbnail,
      category,
      services,
      serviceDetails,
      industry,
      img,
      videoIframeURL,
      isTrending,
    } = await req.json();

    await connectToDB();

    await Works.create({
      title,
      detailsTitle,
      thumbnail,
      category,
      services,
      serviceDetails,
      industry,
      img,
      videoIframeURL,
      isTrending,
    });

    return NextResponse.json({ message: "works created" }, { status: 201 });
  } catch (error) {
    console.error("Error creating works:", error);
    return NextResponse.json(
      { message: "Failed to create work" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    await connectToDB();
    const deletedHero = await Works.findByIdAndDelete(id);
    if (!deletedHero) {
      return NextResponse.json(
        { message: "Work data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Work data deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete work data" },
      { status: 500 }
    );
  }
}
