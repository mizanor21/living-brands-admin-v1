import { connectToDB } from "@/app/lib/connectToDB";
import { WhoWeAre } from "@/app/lib/WhoWeAre/model";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const { id } = params;
  const updateData = await req.json();

  await connectToDB();

  try {
    const updatedWhoWeAre = await WhoWeAre.findByIdAndUpdate(id, updateData, {
      new: true, // Returns the updated document
      runValidators: true, // Ensures model validation
    });

    if (!updatedWhoWeAre) {
      return NextResponse.json(
        { message: "WhoWeAre data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Data Successfully Updated", data: updatedWhoWeAre },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update WhoWeAre data:", error);
    return NextResponse.json(
      { message: "Failed to update WhoWeAre data" },
      { status: 500 }
    );
  }
}
