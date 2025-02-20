import { connectToDB } from "@/app/lib/connectToDB";
import { Slideshow } from "@/app/lib/Slideshow/model";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const { id } = params;
  const updateData = await req.json();

  await connectToDB();

  try {
    const data = await Slideshow.findByIdAndUpdate(id, updateData, {
      new: true, // Returns the updated document
      runValidators: true, // Ensures model validation
    });

    if (!data) {
      return NextResponse.json(
        { message: "Data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Data Successfully Updated", data: updateData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update data:", error);
    return NextResponse.json(
      { message: "Failed to update data" },
      { status: 500 }
    );
  }
}

export async function GET({ params }) {
  const { id } = params;
  await connectToDB();
  const team = await Slideshow.findOne({ _id: id });
  if (!team) {
    return NextResponse.json(
      { message: "Data not found" },
      { status: 404 }
    );
  }
  return NextResponse.json(team, { status: 200 });
}
