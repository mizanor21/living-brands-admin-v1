import { Achievements } from "@/app/lib/Achievements/model";
import { connectToDB } from "@/app/lib/connectToDB";
import { Teams } from "@/app/lib/Teams/model";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const { id } = params;
  const updateData = await req.json();

  await connectToDB();

  try {
    const updatedJob = await Achievements.findByIdAndUpdate(id, updateData, {
      new: true, // Returns the updated document
      runValidators: true, // Ensures model validation
    });

    if (!updatedJob) {
      return NextResponse.json(
        { message: "achievement data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Data Successfully Updated", data: updatedJob },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update achievement data:", error);
    return NextResponse.json(
      { message: "Failed to update achievement data" },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  const { id } = params;
  await connectToDB();
  const achievement = await Achievements.findOne({ _id: id });
  if (!achievement) {
    return NextResponse.json(
      { message: "achievement data not found" },
      { status: 404 }
    );
  }
  return NextResponse.json(achievement, { status: 200 });
}
