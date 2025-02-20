import { Works } from "@/app/lib/Works/model";
import { connectToDB } from "@/app/lib/connectToDB";
// import { Works } from "@/app/lib/Works/model";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = params;
  await connectToDB();
  const work = await Works.findOne({ _id: id });
  if (!work) {
    return NextResponse.json({ message: "Works not found" }, { status: 404 });
  }
  const response = NextResponse.json({ work }, { status: 200 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

export async function PATCH(req, { params }) {
  try {
    const {
      title,
      detailsTitle,
      thumbnail,
      category,
      services,
      serviceDetails,
      industry,
      img,
      videoIframeURL,
      isTrending,
    } = await req.json();
    const { id } = params;
    // Connect to the database
    await connectToDB();

    // Update the work document with the provided _id
    const updatedWork = await Works.findByIdAndUpdate(
      id,
      {
        title,
        detailsTitle,
        thumbnail,
        category,
        services,
        serviceDetails,
        industry,
        img,
        videoIframeURL,
        isTrending,
      },
      { new: true } // Return the updated document
    );

    // Check if the document was found and updated
    if (!updatedWork) {
      return NextResponse.json({ message: "Work not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Work updated successfully", work: updatedWork },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating work:", error);
    return NextResponse.json(
      { message: "Failed to update work" },
      { status: 500 }
    );
  }
}
