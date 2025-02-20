import { ColorPalate } from "@/app/lib/ColorPalate/model";
import { connectToDB } from "@/app/lib/connectToDB";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const { id } = params;
  const updateData = await req.json();

  await connectToDB();

  try {
    const updatedColorPalate = await ColorPalate.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true, // Returns the updated document
        runValidators: true, // Ensures model validation
      }
    );

    if (!updatedColorPalate) {
      return NextResponse.json(
        { message: "ColorPalate data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Data Successfully Updated", data: updatedColorPalate },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update ColorPalate data:", error);
    return NextResponse.json(
      { message: "Failed to update ColorPalate data" },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  const { id } = params;
  await connectToDB();
  const colorPalate = await ColorPalate.findOne({ _id: id });
  if (!colorPalate) {
    return NextResponse.json(
      { message: "colorPalate data not found" },
      { status: 404 }
    );
  }
  return NextResponse.json(colorPalate, { status: 200 });
}
