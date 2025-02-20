import { connectToDB } from "@/app/lib/connectToDB";
import { News } from "@/app/lib/NewsCenter/model";
import { NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for the PATCH request
const newsSchema = z.object({
  img: z.string().url("Invalid image URL"),
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  details: z.string().min(1, "Details are required"),
  isTrending: z.boolean(),
});

// GET handler
export async function GET(req, { params }) {
  try {
    const { id } = params;

    // Connect to database
    await connectToDB();

    // Fetch news by ID
    const news = await News.findOne({ _id: id });

    if (!news) {
      return NextResponse.json({ message: "News not found" }, { status: 404 });
    }

    const response = NextResponse.json({ news }, { status: 200 });

    // Set CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*");

    return response;
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PATCH handler
export async function PATCH(req, { params }) {
  try {
    const { id } = params;

    // Parse and validate request body
    const body = await req.json();
    const validatedData = newsSchema.parse(body);

    // Connect to database
    await connectToDB();

    // Update the news document
    const updatedNews = await News.findByIdAndUpdate(id, validatedData, {
      new: true, // Return the updated document
    });

    if (!updatedNews) {
      return NextResponse.json({ message: "News not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "News updated successfully", news: updatedNews },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation Error", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating news:", error);
    return NextResponse.json(
      { message: "Failed to update news" },
      { status: 500 }
    );
  }
}
