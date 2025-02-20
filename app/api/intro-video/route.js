import { connectToDB } from "@/app/lib/connectToDB";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { public_id, secure_url } = await request.json();

    if (!public_id || !secure_url) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Image URL:", secure_url); // Log the image URL

    const { db } = await connectToDB();

    const result = await db.collection("images").insertOne({
      public_id,
      secure_url,
      createdAt: new Date(),
    });
    console.log(result);

    return NextResponse.json(
      {
        message: "Image data saved successfully",
        id: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving image data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
