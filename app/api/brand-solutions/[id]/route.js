import { connectToDB } from "@/app/lib/connectToDB";
import { NextResponse } from "next/server";
import { BrandSolutions } from "../../../lib/BrandSolutions/model";

export async function PATCH(req, { params }) {
  const { id } = params;
  const updateData = await req.json();

  await connectToDB();

  try {
    const updatedBrandSolutions = await BrandSolutions.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true, // Returns the updated document
        runValidators: true, // Ensures model validation
      }
    );

    if (!updatedBrandSolutions) {
      return NextResponse.json(
        { message: "team data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Data Successfully Updated", data: updatedBrandSolutions },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update team data:", error);
    return NextResponse.json(
      { message: "Failed to update team data" },
      { status: 500 }
    );
  }
}
