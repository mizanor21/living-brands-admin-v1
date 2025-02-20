import { Blogs } from "@/app/lib/Blogs/models";
import { connectToDB } from "@/app/lib/connectToDB";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectToDB();
  const data = await Blogs.find();
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

    await Blogs.create({
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

    return NextResponse.json({ message: "blogs created" }, { status: 201 });
  } catch (error) {
    console.error("Error creating blogs:", error);
    return NextResponse.json(
      { message: "Failed to create blogs" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    await connectToDB();
    const deletedHero = await Blogs.findByIdAndDelete(id);
    if (!deletedHero) {
      return NextResponse.json(
        { message: "blog data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "blog data deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete blog data" },
      { status: 500 }
    );
  }
}
