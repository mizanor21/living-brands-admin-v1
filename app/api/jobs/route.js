import { connectToDB } from "@/app/lib/connectToDB";
import { JobCircular } from "@/app/lib/jobs/model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  const data = await JobCircular.find();
  const response = NextResponse.json(data);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

export async function POST(req) {
  try {
    // Parse the request JSON body
    const edgeData = await req.json();

    // Database connection
    await connectToDB();

    // Optional: Perform server-side validation if needed
    if (
      !edgeData.jobId ||
      !edgeData.title ||
      !edgeData.company ||
      !edgeData.salary
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new job circular document in MongoDB
    const job = await JobCircular.create(edgeData);
    return NextResponse.json(
      { message: "Job data created successfully", job },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating job data:", error);

    // Send error response with detailed error message
    return NextResponse.json(
      { message: "Failed to create job data", error: error.message },
      { status: 500 }
    );
  }
}
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    await connectToDB();
    const deletedJob = await JobCircular.findByIdAndDelete(id);
    if (!deletedJob) {
      return NextResponse.json(
        { message: "Job data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Job data deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete Job data" },
      { status: 500 }
    );
  }
}
