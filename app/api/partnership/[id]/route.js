import { connectToDB } from "@/app/lib/connectToDB";
import { Partnership } from "@/app/lib/partnership/model";
import { Teams } from "@/app/lib/Teams/model";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const { id } = params;
  const updateData = await req.json();

  await connectToDB();

  try {
    const updatedJob = await Partnership.findByIdAndUpdate(id, updateData, {
      new: true, // Returns the updated document
      runValidators: true, // Ensures model validation
    });

    if (!updatedJob) {
      return NextResponse.json(
        { message: "team data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Data Successfully Updated", data: updatedJob },
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

export async function GET(req, { params }) {
  const { id } = params;
  await connectToDB();
  const partnership = await Partnership.findOne({ _id: id });
  if (!partnership) {
    return NextResponse.json(
      { message: "partnership data not found" },
      { status: 404 }
    );
  }
  return NextResponse.json(partnership, { status: 200 });
}
