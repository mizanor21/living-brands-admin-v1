import { connectToDB } from "@/app/lib/connectToDB";
import { MouseMovement } from "@/app/lib/Home/mouseMovement";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = params;
  await connectToDB();
  const job = await MouseMovement.findOne({ _id: id });
  if (!job) {
    return NextResponse.json(
      { message: "MouseMovement data not found" },
      { status: 404 }
    );
  }
  return NextResponse.json(job, { status: 200 });
}

export async function PATCH(req) {
  const updateData = await req.json();
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  await connectToDB();

  try {
    const mouseMovementHero = await MouseMovement.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!mouseMovementHero) {
      return NextResponse.json(
        { message: "Mousemovement data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Data Successfully Updated", data: mouseMovementHero },
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
