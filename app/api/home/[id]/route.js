import { connectToDB } from "@/app/lib/connectToDB";
import { Home } from "@/app/lib/Home/models";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const { id } = params;

  // Parse JSON data from the request body
  let updateData;
  try {
    updateData = await req.json();
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return NextResponse.json({ message: "Invalid JSON data" }, { status: 400 });
  }

  await connectToDB();

  try {
    // Attempt to find and update the document by ID
    const updatedHome = await Home.findByIdAndUpdate(id, updateData, {
      new: true, // Returns the updated document
      runValidators: true, // Ensures model validation
    });

    // Check if document was found
    if (!updatedHome) {
      return NextResponse.json(
        { message: "Home data not found" },
        { status: 404 }
      );
    }

    // Successful update
    return NextResponse.json(
      { message: "Data Successfully Updated", data: updatedHome },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating data:", error);
    return NextResponse.json(
      { message: "Failed to update Home data", error: error.message },
      { status: 500 }
    );
  }
}
