import { connectToDB } from "@/app/lib/connectToDB";
import { MediaSolutions } from "@/app/lib/MediaSolutions/model";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const { id } = params;
  const updateData = await req.json();

  await connectToDB();

  try {
    const updatedMediaSolutions = await MediaSolutions.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true, // Returns the updated document
        runValidators: true, // Ensures model validation
      }
    );

    if (!updatedMediaSolutions) {
      return NextResponse.json(
        { message: "media data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Data Successfully Updated", data: updatedMediaSolutions },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update media data:", error);
    return NextResponse.json(
      { message: "Failed to update media data" },
      { status: 500 }
    );
  }
}
