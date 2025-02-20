import { connectToDB } from "@/app/lib/connectToDB";
import { JobCircular } from "@/app/lib/jobs/model";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const { id } = params;
  const updateData = await req.json();

  await connectToDB();

  try {
    const updatedJob = await JobCircular.findByIdAndUpdate(id, updateData, {
      new: true, // Returns the updated document
      runValidators: true, // Ensures model validation
    });

    if (!updatedJob) {
      return NextResponse.json(
        { message: "Job data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Data Successfully Updated", data: updatedJob },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update job data:", error);
    return NextResponse.json(
      { message: "Failed to update job data" },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  const { id } = params;
  await connectToDB();
  const job = await JobCircular.findOne({ _id: id });
  if (!job) {
    return NextResponse.json(
      { message: "Job data not found" },
      { status: 404 }
    );
  }
  return NextResponse.json(job, { status: 200 });
}
