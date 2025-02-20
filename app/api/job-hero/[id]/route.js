import { connectToDB } from "@/app/lib/connectToDB";
import { JobHero } from "@/app/lib/JobHero/model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  try {
    const heroes = await JobHero.find({});
    return NextResponse.json(heroes, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch hero data:", error);
    return NextResponse.json(
      { message: "Failed to fetch hero data" },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  const updateData = await req.json();
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  await connectToDB();

  try {
    const updatedHero = await JobHero.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedHero) {
      return NextResponse.json(
        { message: "Job hero data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Data Successfully Updated", data: updatedHero },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update hero data:", error);
    return NextResponse.json(
      { message: "Failed to update hero data" },
      { status: 500 }
    );
  }
}
