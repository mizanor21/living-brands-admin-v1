import { connectToDB } from "@/app/lib/connectToDB";
import { ContactImg } from "@/app/lib/Contact/modelImg";
import { NextResponse } from "next/server";

// Handle GET requests
export async function GET() {
  await connectToDB();
  const data = await ContactImg.find();

  const response = NextResponse.json(data);
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, OPTIONS"
  );
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  return response;
}

export async function POST(req) {
  try {
    const jobHeroData = await req.json();

    // Connect to the database
    await connectToDB();
    await ContactImg.create(jobHeroData);
    return NextResponse.json(
      { message: "Contact data created" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating Contact data:", error);
    return NextResponse.json(
      { message: "Failed to create Contact data" },
      { status: 500 }
    );
  }
}


export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    await connectToDB();
    const deletedContactImg = await ContactImg.findByIdAndDelete(id);
    if (!deletedContactImg) {
      return NextResponse.json(
        { message: "Blog data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "ContactImg data deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete ContactImg data" },
      { status: 500 }
    );
  }
}
// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");

  return new NextResponse(null, { status: 204, headers });
}
